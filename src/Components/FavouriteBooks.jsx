import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import loadingIcon from "../assets/loading.png";
import { Link } from "react-router-dom";

export default function FavouriteBooks() {
  function oneBook(book) {
    setSelectedBook(book);
  }

  // useContext props

  const { favourites, loading, error, setSelectedBook, favIcon } =
    useContext(AppContext);

  // useEffects for localstorage når favoritt bøker endres og
  // når fav icon endres.
  useEffect(() => {
    // Lagre favoritter i localStorage når de endres
    localStorage.setItem("favouriteBooks", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <>
      {loading && (
        <p>
          Loading...<img className="spinning" src={loadingIcon}></img>
        </p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="header">
        <h2>Favoritt Bøker</h2>
        <p>Her vil dine favoritt bøker vises!</p>
      </div>
      <div className="detailbook-container">
        {favourites.length > 0 ? (
          favourites.map((book) => (
            <div key={book.id} className="favourite-book">
              <h3>{book.title}</h3>
              <Link to={`/book/${book.id}`}>
                <img
                  onClick={() => oneBook(book)}
                  className="book-img"
                  src={book.formats["image/jpeg"]}
                  alt={book.title}
                ></img>
              </Link>
            </div>
          ))
        ) : (
          <p>Du har ingen favoritt bøker enda!</p>
        )}
      </div>
    </>
  );
}
