import { useContext, useRef, useEffect } from "react";
import { AppContext } from "./AppContext.jsx";
import favouriteIcon from "../assets/favourite.png";

export default function DetailBook() {
  // useContext props
  const {
    selectedBook,
    selectedCategory,
    favourites,
    setFavourites,
    setFavIcon,
    favIcon,
  } = useContext(AppContext);
  console.log("selected Book: ", selectedBook);

  const favouriteRef = useRef(null);

  // Sett favIcon basert på om valgt bok ligger i favorites
  useEffect(() => {
    if (!selectedBook) return;
    const isFav = favourites.some((b) => b.id === selectedBook.id);
    setFavIcon(isFav);
  }, [selectedBook, favourites, setFavIcon]);

  function favourite(book) {
    console.log(`Du har valgt ${selectedBook.title} som din favoritt bok!`);
    // favouriteRef.current.classList.remove("hidden");
    setFavourites((prev) => {
      // Sjekk om boken allerede er i favorittlisten
      if (prev.some((favBook) => favBook.id === book.id)) {
        return prev; // Hvis den er der, returner den eksisterende listen uten endringer
      } else {
        return [...prev, book]; // Ellers legg til den nye boken i listen
      }
    });
    setFavIcon(true);
  }
  function removeFavourite(book) {
    console.log(
      `Du har fjernet ${selectedBook.title} vekk ifra å være en favoritt bok`
    );
    // favouriteRef.current.classList.add("hidden");
    // if (!favouriteRef.current.classList.contains("hidden")) {
    favouriteRef.current.classList.add("book-img-large");
    // }
    setFavourites((prev) => prev.filter((favBook) => favBook.id !== book.id)); // Alle favoritt bøker som IKKE er lik valgt bok id blir returnert som en array til setFavoritt
    setFavIcon(false);
  }
  // useEffect
  //
  useEffect(() => {
    try {
      // Lagre favoritt icon i localStorage når de endres
      localStorage.setItem("favouriteIcon", JSON.stringify(favIcon));
    } catch (e) {
      console.error("Could not save favouriteIcon:", e);
    }
  }, [favIcon]);

  if (!selectedBook) return <p>Ingen bok valgt.</p>;
  return (
    <>
      <div className="container-full">
        <div className="detailbook-container">
          <h2>
            Detaljer for valgt bok: <br></br> {selectedBook.title}{" "}
          </h2>

          <li id="book">{selectedBook.title}</li>
          <img
            className="book-img"
            src={selectedBook.formats["image/jpeg"]}
            alt={selectedBook.title}
          />
          <p>
            <strong>Forfatter:</strong>{" "}
            {selectedBook.authors.map((a) => a.name).join(", ")}
          </p>
          <p>
            <strong>Språk: </strong>
            {selectedBook.languages.join(", ")}
          </p>
          <p>
            <strong>Lastet ned:</strong> {selectedBook.download_count} ganger
          </p>
          <p>
            <strong>Kategori: </strong>
            {selectedCategory ||
              selectedBook.bookshelves.map((cat, index) => {
                return (
                  <span key={index}>{cat.replace("Category: ", " ")}</span>
                );
              })}
          </p>
          <strong>Sammendrag : </strong>
          <p>{selectedBook.summaries}</p>
          <a href={selectedBook.formats["text/html"]} target="_blank">
            Les boken her
          </a>
          <hr />
          <p className="favourite">
            <button className="fav-btn" onClick={() => favourite(selectedBook)}>
              Sett favoritt bok
            </button>
            <button
              className="fav-btn"
              onClick={() => removeFavourite(selectedBook)}
            >
              Fjern favoritt bok
            </button>
            <img src={favouriteIcon} alt="favoritt ikon" />
          </p>
        </div>
        {favIcon && (
          <img
            className="book-img-large"
            ref={favouriteRef}
            src={favouriteIcon}
          />
        )}
      </div>
    </>
  );
}
