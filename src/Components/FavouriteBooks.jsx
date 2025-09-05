import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import loadingIcon from "../assets/loading.png";
export default function FavouriteBooks() {
  // useContext props

  const { favourites, setFavourites, loading, error } = useContext(AppContext);
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
              <img
                className="book-img"
                src={book.formats["image/jpeg"]}
                alt={book.title}
              ></img>
            </div>
          ))
        ) : (
          <p>Du har ingen favoritt bøker enda!</p>
        )}
      </div>
    </>
  );
}
