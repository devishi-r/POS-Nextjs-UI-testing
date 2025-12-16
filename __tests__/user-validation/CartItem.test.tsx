import { render, screen, fireEvent } from "@testing-library/react";
import CartItem from "@/components/cart/CartItem";
import "@testing-library/jest-dom";

// uses a mock callback and rerender mechanism to simulate how a parent would manage state udpates

describe("CartItem - Quantity Validation & UI Logic", () => {
  const IDX = 0; //fixed index value since test renders only one item

  function setup(initialQty = 1) {
    let currentQty = initialQty; //fake parent state (since onqtychange defined as a controlled component in implementation)

    const mockOnQtyChange = jest.fn((newQty: number) => {
      currentQty = newQty;
      rerenderComponent();
    });

    let rerenderComponent = () => {}; //placeholder function 

    function renderComponent() {
      const utils = render(
        <CartItem
          name="Laptop"
          price={1000}
          stock={5}
          qty={currentQty}
          onQtyChange={mockOnQtyChange}
        />
      );

      rerenderComponent = () =>
        utils.rerender(
          <CartItem
            name="Laptop"
            price={1000}
            stock={5}
            qty={currentQty}
            onQtyChange={mockOnQtyChange}
          />
        );
    }

    renderComponent();
    return { mockOnQtyChange };
  }

  test("renders initial qty = 1 and correct subtotal", () => {
    setup();

    expect(screen.getByTestId(`qty-input-${IDX}`)).toHaveValue("1");
    expect(screen.getByTestId(`subtotal-${IDX}`)).toHaveTextContent("1000");
  });

  test("increment button increases quantity until stock limit", () => {
    const { mockOnQtyChange } = setup(1);

    for (const expected of [2, 3, 4]) {
      fireEvent.click(screen.getByTestId(`qty-plus-${IDX}`));
      expect(mockOnQtyChange).toHaveBeenCalledWith(expected);
    }
  });

  test("increment beyond stock shows error and does not update qty", () => {
    const { mockOnQtyChange } = setup(5);

    fireEvent.click(screen.getByTestId(`qty-plus-${IDX}`));

    expect(screen.getByTestId(`qty-error-${IDX}`)).toHaveTextContent(/exceed/i);
    expect(mockOnQtyChange).not.toHaveBeenCalled();
  });

  test("decrement button decreases quantity until minimum of 1", () => {
    const { mockOnQtyChange } = setup(3);

    for (const expected of [2, 1]) {
      fireEvent.click(screen.getByTestId(`qty-minus-${IDX}`));
      expect(mockOnQtyChange).toHaveBeenCalledWith(expected);
    }
  });

  test("decrementing below 1 shows error and prevents update", () => {
    const { mockOnQtyChange } = setup(1);

    fireEvent.click(screen.getByTestId(`qty-minus-${IDX}`));

    expect(screen.getByTestId(`qty-error-${IDX}`)).toHaveTextContent(/at least 1/i);
    expect(mockOnQtyChange).not.toHaveBeenCalled();
  });

  test("manual input updates qty correctly when valid", () => {
    const { mockOnQtyChange } = setup(1);

    fireEvent.change(screen.getByTestId(`qty-input-${IDX}`), {
      target: { value: "3" },
    });

    expect(mockOnQtyChange).toHaveBeenCalledWith(3);
    expect(screen.getByTestId(`subtotal-${IDX}`)).toHaveTextContent("3000");
  });

  test("manual input beyond stock shows error and prevents update", () => {
    const { mockOnQtyChange } = setup(1);

    fireEvent.change(screen.getByTestId(`qty-input-${IDX}`), {
      target: { value: "10" },
    });

    expect(screen.getByTestId(`qty-error-${IDX}`)).toHaveTextContent(/exceed/i);
    expect(mockOnQtyChange).not.toHaveBeenCalled();
  });

  test("non-numeric input shows validation error", () => {
    const { mockOnQtyChange } = setup(1);

    fireEvent.change(screen.getByTestId(`qty-input-${IDX}`), {
      target: { value: "abc" },
    });

    expect(screen.getByTestId(`qty-error-${IDX}`)).toHaveTextContent(/valid number/i);
    expect(mockOnQtyChange).not.toHaveBeenCalled();
    expect(screen.getByTestId(`qty-input-${IDX}`)).toHaveValue("1");
  });
});

//currently - parent logic has been faked manually
// more efficient approach - using a wrapper approach:
// function CartItemWrapper({ initialQty = 1 }) {
//   const [qty, setQty] = useState(initialQty);

//   return (
//     <CartItem
//       name="Laptop"
//       price={1000}
//       stock={5}
//       qty={qty}
//       onQtyChange={setQty}
//       index={0}
//     />
//   );
// }
// - involves maintaining a temporary parent component that owns the state (qty) and passes it down to the component being tested