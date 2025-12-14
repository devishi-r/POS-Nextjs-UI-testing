"use client";
import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { initialChartoneOptions } from "@/lib/charts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { //a client-only, lazy-loaded React component that appears after hydration.
  ssr: false, //disabling server side rendering since apexhcarts uses uses browser apis not supported by nextjs ssr
});

interface ChartOneState { //defining shape of data apexcharts expects - (actual data to be plotted, configutation attributes(axes, labels, etc))
  series: { name: string; data: number[] }[];
  options: ApexOptions;
}

const ChartOne: React.FC = () => {
  const [dataChart, setDataChart] = useState<number[]>([]);
  const [startDate, setStartDate] = useState("2024-05-01");
  const [endDate, setEndDate] = useState("2024-05-15"); 
  const [dateError, setDateError] = useState<string | null>(null);
  const [appliedRange, setAppliedRange] = useState({ start: startDate, end: endDate });

  const [state, setState] = useState<ChartOneState>({
    series: [{ name: "Products Sales", data: [] }],
    options: initialChartoneOptions,
  });

  // Generate date range buckets
  const generateDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const list: string[] = [];

    let current = new Date(s);
    while (current <= e) {
      list.push(
        current.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
      current.setDate(current.getDate() + 1);
    }
    return list;
  };

  // Update X-axis only when applied range changes
  useEffect(() => {
    const categories = generateDateRange(appliedRange.start, appliedRange.end);

    setState((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories },
      },
    }));
  }, [appliedRange]); //runs only when applied date range changes

  // Validation Helpers
  const validateStart = (value: string) => {
    const today = new Date();
    if (new Date(value) > today) return "Start date cannot be in the future";
    if (new Date(value) > new Date(endDate))
      return "Start date cannot be after end date";
    return null;
  };

  const validateEnd = (value: string) => {
    const today = new Date();
    if (new Date(value) > today) return "End date cannot be in the future";
    if (new Date(startDate) > new Date(value))
      return "End date must be after start date";
    return null;
  };

  // Fetch API ONLY when Apply clicked
  const fetchData = async (s: string, e: string) => {
    try {
      const res = await axios.get(`/api/productsale?start=${s}&end=${e}`);
      const list = res.data?.combinedResult ?? [];
      const data = list.map((x: any) => x.totalQuantity);
      setDataChart(data);
    } catch (err) {
      console.error("Error fetching", err);
    }
  };

  // Apply Button Handler
  const onApply = () => {
    const err1 = validateStart(startDate);
    const err2 = validateEnd(endDate);

    if (err1 || err2) {
      setDateError(err1 || err2);
      return;
    }

    // Valid → clear error, update applied range, fetch data
    setDateError(null);
    setAppliedRange({ start: startDate, end: endDate });
    fetchData(startDate, endDate);
  };

  // Update chart series when data fetched
  useEffect(() => {
    if (dataChart.length === 0) return;

    const maxVal = Math.max(...dataChart) + 1;

    setState((prev) => ({
      ...prev,
      series: [{ ...prev.series[0], data: dataChart }],
      options: {
        ...prev.options,
        yaxis: { ...prev.options.yaxis, max: maxVal },
      },
    }));
  }, [dataChart]);

  return (
    <div className="h-full w-full col-span-12 rounded-sm border bg-white px-5 pb-5 pt-[1.875rem] shadow">

      {/* Filters Row */}
      <div className="flex gap-6 mb-4">

        {/* Start Date */}
        <div>
          <label className="text-sm mb-1" htmlFor="start-date">Start</label>
          <Input
          id = "start-date"
            data-testid="start-date"
            type="date"
            value={startDate}
            onChange={(e) => {
              const v = e.target.value;
              setStartDate(v);
              // setDateError(validateStart(v));
            }}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm mb-1" htmlFor="end-date">End</label>
          <Input
            id = "end-date"
            data-testid="end-date"
            type="date"
            value={endDate}
            onChange={(e) => {
              const v = e.target.value;
              setEndDate(v);
              // setDateError(validateEnd(v));
            }}
          />
        </div>

        {/* Apply Button */}
        <button
          data-testid="apply-date-filter-btn"
          className="self-end px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onApply}
        >
          Apply
        </button>
      </div>

      {/* Inline Validation Error */}
      {dateError && (
        <p className="text-red-600 mb-4" data-testid="date-error">
          {dateError}
        </p>
      )}

      {/* Chart only visible when valid */}
      {!dateError && (
        <div id="chartOne" data-testid="analytics-chart">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="area"
            height={420}
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default ChartOne;
