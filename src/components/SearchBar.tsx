import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useConstants } from "@/context/ConstantsContext";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const { BACKEND_URL } = useConstants();
  const { token } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [recommendations, setRecommendations] = useState<
    { name: string; source: string }[]
  >([]);
  const [open, setOpen] = useState(false);

  // Fetch recommendations from the backend API
  const fetchRecommendations = async (query: string) => {
    if (query.trim() === "") {
      setRecommendations([]); // Clear recommendations for empty input
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/crop/search/recommendations/?query=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  // Handle input changes and fetch recommendations
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setOpen(true);
    setSearchTerm(query);
    fetchRecommendations(query);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    // Optionally redirect to the search results page or handle search submission
    setOpen(false);
    router.push(`/search?query=${searchTerm}`);
  };

  return (
    <div className="flex flex-col w-full relative px-32">
      {/* Search bar */}
      <div className="flex flex-row w-full">
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          onChange={handleInputChange}
          className="bg-white w-full h-10 rounded"
          value={searchTerm}
        />
        <Button
          color="inherit"
          sx={{ textTransform: "none" }}
          className="bg-blue-600"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Recommendations */}
      {open && recommendations.length > 0 && (
        <div
          className="absolute bg-white shadow-md mt-1 rounded w-full z-10 max-h-60 overflow-y-auto"
          style={{ top: "3rem" }}
        >
          {recommendations.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
              onClick={() => {
                setSearchTerm(item.name), setOpen(false);
              }}
            >
              <div className="flex flex-row">
                <p className="font-medium text-black">{item.name}</p>
                <p className="text-sm text-gray-500 whitespace-pre-line">
                  &emsp;- {item.source}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
