import React from "react";

interface SellerDetailsProps {
  seller: {
    email: string;
    profile_image?: string;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
}

export const SellerDetailsCard: React.FC<SellerDetailsProps> = ({ seller }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Seller Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Details Section */}
        <div>
          {/* Name */}
          {seller.name && (
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {seller.name}
            </p>
          )}

          {/* Email */}
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> {seller.email}
          </p>

          {/* Phone */}
          {seller.phone && (
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> {seller.phone}
            </p>
          )}

          {/* Address */}
          {seller.address && (
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> {seller.address}
            </p>
          )}

          {/* City, State, Country, Zip */}
          {(seller.city || seller.state || seller.country || seller.zip) && (
            <p className="text-gray-700 mb-2">
              <strong>Location:</strong>{" "}
              {[seller.city, seller.state, seller.country, seller.zip]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="flex justify-center items-center">
          <img
            src={seller?.profile_image || "/images/default_profile.jpg"}
            alt="Profile"
            className="shadow-md border border-gray-800 h-32 w-32 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
