'use client';
import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { initialChartoneOptions } from '@/lib/charts';

// Dynamically import ApexCharts only on client
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

interface ChartOneState {
  series: { name: string; data: number[] }[];
  options: ApexOptions;
}

const ChartOne: React.FC = () => {
  const [dataChart, setDataChart] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>('2024-05-01');
  const [endDate, setEndDate] = useState<string>('2024-05-15');

  const [state, setState] = useState<ChartOneState>({
    series: [{ name: 'Products Sales', data: [] }],
    options: initialChartoneOptions,
  });

  // ----------------------------
  // Generate date range
  // ----------------------------
  const generateDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates: string[] = [];

    let current = startDate;
    const sameMonth =
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth();
    const sameYear = startDate.getFullYear() === endDate.getFullYear();

    while (current <= endDate) {
      let f: string;

      if (!sameYear) {
        f = current.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      } else if (!sameMonth) {
        f = current.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      } else {
        f = current.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        });
      }

      if (!dates.includes(f)) dates.push(f);

      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  // ----------------------------
  // Update X-axis categories
  // ----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return; // prevents act() warnings

    const categories = generateDateRange(startDate, endDate);

    setState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        xaxis: { ...prev.options.xaxis, categories }
      }
    }));
  }, [startDate, endDate]);

  // ----------------------------
  // Fetch API Data
  // ----------------------------
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/productsale?start=${startDate}&end=${endDate}`
      );

      // FIX: avoid undefined.map error
      const combinedResult = response.data?.combinedResult ?? [];

      const chartData = combinedResult.map((item: { totalQuantity: number }) =>
        item.totalQuantity
      );

      setDataChart(chartData);
    } catch (e) {
      console.error("Error fetching data", e);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    fetchData();
  }, [startDate, endDate]);

  // ----------------------------
  // Update chart series when data changes
  // ----------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dataChart.length === 0) return;

    const maxVal = Math.max(...dataChart) + 1;

    setState(prev => ({
      ...prev,
      series: [{ ...prev.series[0], data: dataChart }],
      options: {
        ...prev.options,
        yaxis: { ...prev.options.yaxis, max: maxVal }
      }
    }));
  }, [dataChart]);

  return (
    <div className="h-full w-full col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-[1.875rem] shadow-de">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex min-w-[11.875rem]">
          <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondarychart">
            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondarychart"></span>
          </span>

          <div className="w-full">
            <p className="font-semibold text-secondarychart">
              Total Products Sales
            </p>

            <div className="flex gap-4">

              {/* Start date - FIXED WITH id + htmlFor */}
              <div className="flex gap-4 items-center">
                <label className="mr-2 text-sm" htmlFor="start-date">
                  Start
                </label>
                <Input
                  id="start-date"
                  className="h-8"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>

              {/* End date - FIXED WITH id + htmlFor */}
              <div className="flex gap-4 items-center">
                <label className="mr-2" htmlFor="end-date">
                  End
                </label>
                <Input
                  id="end-date"
                  className="h-8"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>

            </div>
          </div>
        </div>
      </div>

      <div id="chartOne" className="-ml-5">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={420}
          width="100%"
        />
      </div>
    </div>
  );
};

export default ChartOne;
