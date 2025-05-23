import React from "react";

interface Product {
  name: string;
  quantity_listed: number;
  price: number;
  quantity_sold: number;
  quantity_remaining?: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div>
      <h2 className="font-bold mb-4 text-black">Listed Products</h2>
      <div className="overflow-y-auto max-h-64">
        {" "}
        {/* Added scrollable container */}
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-2 text-black">Product Name</th>
              <th className="border border-gray-300 p-2 text-black">Quantity Listed</th>
              <th className="border border-gray-300 p-2 text-black">Quantity Sold</th>
              <th className="border border-gray-300 p-2 text-black">Quantity Remaining</th>
              <th className="border border-gray-300 p-2 text-black">Price/unit</th>
              <th className="border border-gray-300 p-2 text-black">Price Earned</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2 text-black">{product.name}</td>
                <td className="border border-gray-300 p-2 text-black">
                  {product.quantity_listed}
                </td>
                <td className="border border-gray-300 p-2 text-black">
                  {product.quantity_sold}
                </td>
                <td className="border border-gray-300 p-2 text-black">
                  {product.quantity_remaining}
                </td>
                <td className="border border-gray-300 p-2 text-black">
                  Rs.{product.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2 text-black">
                  Rs.{(product.price * product.quantity_sold).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
