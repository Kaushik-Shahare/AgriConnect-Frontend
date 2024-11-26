// components/ProductCard.tsx
import Image from "next/image";

interface User {
  id: number;
  profile_image: string;
  email: string;
  user_type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface QuantityAdded {
  id: number;
  quantity: number;
  added_at: string;
  crop: number;
}

interface Product {
  id: number;
  user: User;
  name: string;
  image_url: string;
  image_public_id: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  quantity_added: QuantityAdded[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user, name, image_url, description, category, quantity, price } =
    product;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="relative h-48 w-full mb-4">
        <Image
          src={image_url || "/images/default-crop.jpeg"}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-gray-600 text-sm mb-2">{description}</p>
      <p className="text-gray-500 text-xs mb-1">Category: {category}</p>
      <p className="text-gray-700 text-sm mb-1">Available: {quantity} kg</p>
      <p className="text-red-500 font-bold text-lg">₹{price}</p>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Seller: {user.name}</p>
        <p className="text-sm text-gray-600">
          Location: {user.city}, {user.state}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
