"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { initialChartfourOptions } from "@/lib/charts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ChartFourState {
  series: { name: string; data: number[] }[];
  options: ApexOptions;
}

const ChartFour: React.FC = () => {
  const [dataChart, setDataChart] = useState<{
    net: number[];
    tax: number[];
    gross: number[];
  }>({ net: [], tax: [], gross: [] });

  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15");
  const [dateError, setDateError] = useState<string | null>(null);
  const [appliedRange, setAppliedRange] = useState({
    start: "2024-05-01",
    end: "2024-05-15",
  });

  const [state, setState] = useState<ChartFourState>({
    series: [
      { name: "Net Income", data: [] },
      { name: "Tax", data: [] },
      { name: "Gross Income With Tax", data: [] },
    ],
    options: initialChartfourOptions,
  });

  // ----------------------------
  // Generate date labels
  // ----------------------------
  const generateDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const labels: string[] = [];

    const d = new Date(s);
    while (d <= e) {
      labels.push(
        d.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      d.setDate(d.getDate() + 1);
    }
    return labels;
  };

  // Update X-axis ONLY after Apply
  useEffect(() => {
    const categories = generateDateRange(
      appliedRange.start,
      appliedRange.end
    );

    setState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
      },
    }));
  }, [appliedRange]);

  // ----------------------------
  // Fetch API (Apply only)
  // ----------------------------
  const fetchData = async (s: string, e: string) => {
    try {
      const res = await axios.get(`/api/profit?start=${s}&end=${e}`);

      const grouped = res.data?.groupedData ?? [];

      setDataChart({
        net: grouped.map((x: any) => Number(x.netIncome)),
        tax: grouped.map((x: any) => Number(x.taxIncome)),
        gross: grouped.map((x: any) => Number(x.grossIncomeWithTax)),
      });
    } catch (err) {
      console.error("Error fetching income data", err);
    }
  };

  // ----------------------------
  // Apply Button (single authority)
  // ----------------------------
  const onApply = () => {
    const today = new Date();

    if (new Date(startDate) > today) {
      setDateError("Start date cannot be in the future");
      return;
    }

    if (new Date(endDate) > today) {
      setDateError("End date cannot be in the future");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setDateError("Start date cannot be after end date");
      return;
    }

    // VALID
    setDateError(null);
    setAppliedRange({ start: startDate, end: endDate });
    fetchData(startDate, endDate);
  };

  // ----------------------------
  // Update chart series
  // ----------------------------
  useEffect(() => {
    if (!dataChart.gross.length) return;

    const maxVal = Math.max(...dataChart.gross) + 1;

    setState((prev) => ({
      ...prev,
      series: [
        { ...prev.series[0], data: dataChart.net },
        { ...prev.series[1], data: dataChart.tax },
        { ...prev.series[2], data: dataChart.gross },
      ],
      options: {
        ...prev.options,
        yaxis: { ...prev.options.yaxis, max: maxVal },
      },
    }));
  }, [dataChart]);

  return (
    <div className="h-full w-full col-span-12 rounded-sm border bg-white px-5 pb-5 pt-[1.875rem] shadow">

      {/* Filters */}
      <div className="flex gap-6 mb-4">
        <div>
          <label className="text-sm mb-1">Start</label>
          <Input
            data-testid="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm mb-1">End</label>
          <Input
            data-testid="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          data-testid="apply-date-filter-btn"
          className="self-end px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onApply}
        >
          Apply
        </button>
      </div>

      {/* Error */}
      {dateError && (
        <p data-testid="date-error" className="text-red-600 mb-4">
          {dateError}
        </p>
      )}

      {/* Chart */}
      {!dateError && (
        <div id="chartFour" data-testid="analytics-chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height={420}
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default ChartFour;
