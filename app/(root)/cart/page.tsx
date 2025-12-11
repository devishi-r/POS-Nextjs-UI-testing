import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Test Cart</h1>

      <CartItem name="Laptop" price={1000} stock={5} />
      <CartItem name="Mouse" price={20} stock={10} />
    </div>
  );
}
