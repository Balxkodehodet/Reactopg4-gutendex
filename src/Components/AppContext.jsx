import { createContext, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    // Hent favoritter fra localStorage hvis tilgjengelig
    const savedFavourites = localStorage.getItem("favouriteBooks");
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });
  const [error, setError] = useState(null);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
