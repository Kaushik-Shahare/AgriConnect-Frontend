import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface InventoryDonutChartProps {
  inventoryBreakdown: Array<{
    category: string;
    quantity: number;
  }>;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const InventoryDonutChart: React.FC<InventoryDonutChartProps> = ({ inventoryBreakdown }) => {
  const data = {
    labels: inventoryBreakdown.map((item) => item.category),
    datasets: [
      {
        data: inventoryBreakdown.map((item) => item.quantity),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#B2FF66",
          "#FF66B2",
          "#66B2FF",
          "#B266FF",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#B2FF66",
          "#FF66B2",
          "#66B2FF",
          "#B266FF",
        ],
      },
    ],
  };

  const total = inventoryBreakdown.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <h3 className="text-lg font-semibold text-black mb-2">Inventory by Category</h3>
      <Doughnut
        data={data}
        options={{
          responsive: true,
          cutout: "70%",
          plugins: {
            legend: { labels: { color: '#000' } },
            title: { color: '#000' },
          },
        }}
      />
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {inventoryBreakdown.map((item, idx) => (
          <span key={item.category} className="text-sm text-black bg-gray-200 rounded px-2 py-1">
            {item.category}: <span className="font-semibold text-black">{item.quantity}</span>
          </span>
        ))}
      </div>
      <div className="text-center mt-2 text-black text-xs">Total Inventory: {total}</div>
    </motion.div>
  );
};

export default InventoryDonutChart; 