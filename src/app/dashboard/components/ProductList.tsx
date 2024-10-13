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
      <h2 className="font-bold mb-4">Listed Products</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2">Product Name</th>
            <th className="border border-gray-300 p-2">Quantity Listed</th>
            <th className="border border-gray-300 p-2">Quantity Sold</th>
            <th className="border border-gray-300 p-2">Quantity Remaining</th>
            <th className="border border-gray-300 p-2">Price/unit</th>
            <th className="border border-gray-300 p-2">Price Earned</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{product.name}</td>
              <td className="border border-gray-300 p-2">
                {product.quantity_listed}
              </td>
              <td className="border border-gray-300 p-2">
                {product.quantity_sold}
              </td>
              <td className="border border-gray-300 p-2">
                {product.quantity_remaining}
              </td>
              <td className="border border-gray-300 p-2">
                Rs.{product.price.toFixed(2)}
              </td>
              <td className="border border-gray-300 p-2">
                Rs.{(product.price * product.quantity_sold).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
