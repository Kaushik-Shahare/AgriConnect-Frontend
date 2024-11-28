import dynamic from "next/dynamic";

// Dynamically import the SearchPage with SSR disabled
const SearchPage = dynamic(() => import("./components/SearchPage"), {
  ssr: false,
});

export default function Search() {
  return <SearchPage />;
}
