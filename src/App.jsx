import { useState, useContext, useEffect } from "react";
import "./App.css";
import { AppContext } from "./Components/AppContext.jsx";
import loadingIcon from "./assets/loading.png";
import { Link } from "react-router-dom";

function App() {
  const {
    selectedCategory,
    loading,
    setLoading,
    data,
    setData,
    setSelectedBook,
    searchResults,
    error,
    setError,
    nextPage,
    setNextPage,
    nextButtonClicked,
    setNextButtonClicked,
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
      } else if (nextButtonClicked) {
        console.log("setting url for fetching is in progress......");
        url = nextPage;
        setNextButtonClicked(false);
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
      setNextPage(response.next || null);
    } catch (err) {
      setError(`error fetching data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }
  // Useeffect for å hente data når url eller selectedCategory eller searchresults eller nextButton clicked endres
  useEffect(() => {
    const controller = new AbortController();
    fetchData(url);
    return () => {
      controller.abort(); // cleanup cancels previous fetch
    };
  }, [url, selectedCategory, searchResults, nextButtonClicked]);

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
