import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchResults, setSearchResults] = useState("");
  const [favourites, setFavourites] = useState(() => {
    // Hent favoritter fra localStorage hvis tilgjengelig
    const savedFavourites = localStorage.getItem("favouriteBooks");
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);
  const [page, setPage] = useState(1);

  return (
    <AppContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        loading,
        setLoading,
        data,
        setData,
        selectedBook,
        setSelectedBook,
        searchResults,
        setSearchResults,
        favourites,
        setFavourites,
        error,
        setError,
        nextPage,
        setNextPage,
        nextButtonClicked,
        setNextButtonClicked,
        page,
        setPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
