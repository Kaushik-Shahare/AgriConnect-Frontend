import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

// Register necessary components for the charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Tooltip,
  Legend,
  PointElement
);

interface SalesChartProps {
  productSales: Array<{
    name: string;
    quantity_listed: number;
    price: number;
    quantity_sold: number;
    sales: Array<{
      quantity_sold: number;
      price_at_sale: number;
      sale_date: string;
    }>;
  }>;
  period: string;
  salesGrowth: number;
  revenueGrowth: number;
}

const SalesChart: React.FC<SalesChartProps> = ({ productSales, period, salesGrowth, revenueGrowth }) => {
  // Prepare data for the bar chart
  const barChartData = {
    labels: productSales.map((product) => product.name),
    datasets: [
      {
        label: "Total Quantity Sold",
        data: productSales.map((product) => product.quantity_sold),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Determine the maximum quantity sold for setting the y-axis max
  const maxQuantitySold = Math.max(
    ...productSales.map((product) => product.quantity_sold)
  );

  // Prepare data for the line chart based on the selected period
  const lineChartData = {
    labels: [] as string[],
    datasets: [
      {
        label: `Sales Growth (${period})`,
        data: [] as number[],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  const quantityMap: Record<string, number> = {};
  const currentDate = new Date();

  // Helper function to get formatted date string
  const getFormattedDate = (date: Date, isHour: boolean = false): string => {
    const options: Intl.DateTimeFormatOptions = isHour
      ? { hour: "2-digit", hour12: false }
      : { month: "numeric", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Aggregate sales data based on the period
  productSales.forEach((product) => {
    product.sales.forEach((sale) => {
      const date = new Date(sale.sale_date);
      let label: string = "";

      if (period === "1day") {
        // Only show sales for the last 24 hours
        if (currentDate.getTime() - date.getTime() <= 24 * 60 * 60 * 1000) {
          label = getFormattedDate(date, true); // Hourly data
          if (!quantityMap[label]) {
            quantityMap[label] = 0; // Initialize if not present
          }
          quantityMap[label] += sale.quantity_sold; // Aggregate quantity sold
        }
      } else if (period === "30days") {
        // Only show sales for the last 30 days
        if (
          currentDate.getTime() - date.getTime() <=
          30 * 24 * 60 * 60 * 1000
        ) {
          label = getFormattedDate(date); // Daily data
          if (!quantityMap[label]) {
            quantityMap[label] = 0; // Initialize if not present
          }
          quantityMap[label] += sale.quantity_sold; // Aggregate quantity sold
        }
      } else if (period === "1year") {
        // Only show sales for the last year
        if (currentDate.getFullYear() === date.getFullYear()) {
          label = getFormattedDate(date); // Monthly data
          if (!quantityMap[label]) {
            quantityMap[label] = 0; // Initialize if not present
          }
          quantityMap[label] += sale.quantity_sold; // Aggregate quantity sold
        }
      }
    });
  });

  // Prepare labels and data for the line chart
  lineChartData.labels = Object.keys(quantityMap).sort(); // Sort labels for correct order
  lineChartData.datasets[0].data = lineChartData.labels.map(
    (label) => quantityMap[label]
  );

  // Helper for badge color
  const badgeColor = (val: number) =>
    val > 0 ? "bg-green-100 text-green-700" : val < 0 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700";

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold text-black">Product Sales</h3>
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            scales: {
              y: {
                max: maxQuantitySold,
                ticks: { color: '#000' },
                title: { color: '#000' },
              },
              x: {
                ticks: { color: '#000' },
                title: { color: '#000' },
              },
            },
            plugins: {
              legend: { labels: { color: '#000' } },
              title: { color: '#000' },
            },
          }}
        />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4 mb-2">
          <h3 className="text-lg font-semibold text-black mb-0">Growth Rate Over Time</h3>
          <span className={`px-2 py-1 rounded text-sm font-semibold ${badgeColor(salesGrowth)}`}>Sales: {salesGrowth.toFixed(1)}%</span>
          <span className={`px-2 py-1 rounded text-sm font-semibold ${badgeColor(revenueGrowth)}`}>Revenue: {revenueGrowth.toFixed(1)}%</span>
        </div>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            scales: {
              y: { ticks: { color: '#000' }, title: { color: '#000' } },
              x: { ticks: { color: '#000' }, title: { color: '#000' } },
            },
            plugins: {
              legend: { labels: { color: '#000' } },
              title: { color: '#000' },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SalesChart;
