import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesAnalysisProps {
  totalSales: number;
  totalRevenue: number;
  salesData: { name: string; quantitySold: number }[]; // Array of product sales data
}

const SalesAnalysis: React.FC<SalesAnalysisProps> = ({
  totalSales,
  totalRevenue,
  salesData,
}) => {
  // Prepare data for the Pie chart
  const pieData = {
    labels: salesData.map((product) => product.name),
    datasets: [
      {
        data: salesData.map((product) => product.quantitySold),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Chart options (resize chart)
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4">
      <h1 className="text-black font-bold text-xl mb-4">Sales Analysis</h1>
      <div className="flex flex-row justify-between space-x-4">
        <div className="flex-1 bg-red-200 p-4 rounded shadow">
          <p className="font-semibold">Total Sales:</p>
          <p className="text-4xl">{totalSales}</p>
        </div>
        <div className="flex-1 bg-green-200 p-4 rounded shadow">
          <p className="font-semibold">Total Revenue:</p>
          <p className="text-4xl">Rs.{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Pie chart section with smaller size */}
      <div className="mt-8">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-black font-bold mb-4">Sales Distribution</h2>
          <div
            className="relative mx-auto"
            style={{ width: "300px", height: "300px" }}
          >
            {/* Set custom size */}
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
