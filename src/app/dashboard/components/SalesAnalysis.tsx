import React from "react";

interface SalesAnalysisProps {
  totalSales: number;
  totalRevenue: number;
}

const SalesAnalysis: React.FC<SalesAnalysisProps> = ({
  totalSales,
  totalRevenue,
}) => {
  return (
    <div>
      <h1 className="text-black font-bold">Sales Analysis</h1>
      <p>Total Sales: {totalSales}</p>
      <p>Total Revenue: Rs.{totalRevenue.toFixed(2)}</p>
    </div>
  );
};

export default SalesAnalysis;
