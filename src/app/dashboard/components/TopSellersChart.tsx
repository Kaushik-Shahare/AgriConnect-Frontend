import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface TopSellersChartProps {
  topSellers: Array<{
    name: string;
    quantity_sold: number;
  }>;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const TopSellersChart: React.FC<TopSellersChartProps> = ({ topSellers }) => {
  const data = {
    labels: topSellers.map((p) => p.name),
    datasets: [
      {
        label: "Top Sellers (Qty Sold)",
        data: topSellers.map((p) => p.quantity_sold),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <h3 className="text-lg font-semibold text-black mb-2">Top 5 Sellers</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { labels: { color: '#000' }, display: false },
            title: { color: '#000' },
          },
          scales: {
            x: { ticks: { color: '#000' }, title: { color: '#000' } },
            y: { ticks: { color: '#000' }, title: { color: '#000' } },
          },
        }}
      />
    </motion.div>
  );
};

export default TopSellersChart; 