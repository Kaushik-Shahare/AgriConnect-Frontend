import React from "react";
import { motion } from "framer-motion";

interface RecentSalesTableProps {
  recentSales: Array<{
    crop_name: string;
    crop_image_url: string;
    quantity_sold: number;
    price_at_sale: number;
    sale_date: string;
    buyer: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const RecentSalesTable: React.FC<RecentSalesTableProps> = ({ recentSales }) => {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      <h3 className="text-lg font-semibold text-black mb-2">Recent Sales</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2 text-black">Product</th>
              <th className="border border-gray-300 p-2 text-black">Image</th>
              <th className="border border-gray-300 p-2 text-black">Quantity Sold</th>
              <th className="border border-gray-300 p-2 text-black">Price at Sale</th>
              <th className="border border-gray-300 p-2 text-black">Sale Date</th>
              <th className="border border-gray-300 p-2 text-black">Buyer</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-black p-4">
                  No recent sales.
                </td>
              </tr>
            ) : (
              recentSales.map((sale, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2 text-black">{sale.crop_name}</td>
                  <td className="border border-gray-300 p-2 text-black">
                    {sale.crop_image_url ? (
                      <img src={sale.crop_image_url} alt={sale.crop_name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-black">No Image</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-black">{sale.quantity_sold}</td>
                  <td className="border border-gray-300 p-2 text-black">₹{Number(sale.price_at_sale).toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-black">{new Date(sale.sale_date).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2 text-black">
                    <span className="font-semibold text-black">{sale.buyer.name}</span>
                    <br />
                    <span className="text-xs text-black">{sale.buyer.email}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentSalesTable; 