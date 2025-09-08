import { useState, useContext, useEffect } from "react";
import "./App.css";
import { AppContext } from "./Components/AppContext.jsx";
import loadingIcon from "./assets/loading.png";
import { Link } from "react-router-dom";
import FavouriteBooks from "./Components/FavouriteBooks.jsx";

function App() {
  const {
    selectedCategory,
    loading,
    setLoading,
    data,
    setData,
    selectedBook,
    setSelectedBook,
    searchResults,
    setSearchResults,
    error,
    setError,
  } = useContext(AppContext);

  let url = "";
  async function fetchData(url) {
    if (selectedCategory || searchResults.length > 0) {
      setLoading(true);
    }
    setError(null);
    try {
      if (selectedCategory) {
        // Bruker `topic` parameter for å filtrere bøker
        url = `https://gutendex.com/books?topic=${selectedCategory.toLowerCase()}`;
      } else if (searchResults.length > 0) {
        url = `https://gutendex.com/books?search=${searchResults}`;
      } else {
        return;
      }

      const data2 = await fetch(url);
      if (!data2.ok) {
        setError(`Failed to fetch data. Status: ${data2.status}`);
        return;
      }
      const response = await data2.json();
      setData(response.results || []);
    } catch (err) {
      setError(`error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  // Useeffect for å hente data når url eller selectedCategory eller searchresults endres
  useEffect(() => {
    const controller = new AbortController();
    fetchData(url);
    return () => {
      controller.abort(); // cleanup cancels previous fetch
    };
  }, [url, selectedCategory, searchResults]);

  // Funksjon for å velge en bok og sette den som valgt i context slik at DetailBook.jsx kan bruke den
  function chosenBook(book) {
    console.log("You chose a book!", book.title);
    setSelectedBook(book);
  }
  return (
    <>
      {loading && (
        <p>
          Loading...<img className="spinning" src={loadingIcon}></img>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data && (
        <ul id="book-list">
          {data.map((book) => (
            <div id="div-booklist" key={book.id}>
              <li id="book">{book.title}</li>
              <Link to={`/book/${book.id}`}>
                <img
                  onClick={() => chosenBook(book)}
                  className="book-img"
                  src={book.formats["image/jpeg"]}
                  alt={book.title}
                />
              </Link>
              <p>
                <strong>Forfatter:</strong>{" "}
                {book.authors.map((a) => a.name).join(", ")}
              </p>
            </div>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
