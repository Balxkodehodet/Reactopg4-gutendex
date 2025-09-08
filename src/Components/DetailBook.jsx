import { useContext, useRef } from "react";
import { AppContext } from "./AppContext.jsx";
import favouriteIcon from "../assets/favourite.png";
export default function DetailBook() {
  // useContext props
  const { selectedBook, selectedCategory, favourites, setFavourites } =
    useContext(AppContext);
  console.log("selected Book: ", selectedBook);

  const favouriteRef = useRef(null);

  function favourite(book) {
    console.log(`Du har valgt ${selectedBook.title} som din favoritt bok!`);
    favouriteRef.current.classList.toggle("hidden");
    if (!favouriteRef.current.classList.contains("hidden")) {
      favouriteRef.current.classList.add("book-img-large");
    }
    setFavourites((prev) => {
      // Sjekk om boken allerede er i favorittlisten
      if (prev.some((favBook) => favBook.id === book.id)) {
        return prev; // Hvis den er der, returner den eksisterende listen uten endringer
      } else {
        return [...prev, book]; // Ellers legg til den nye boken i listen
      }
    });
  }

  return (
    <>
      <div className="container-full">
        <div className="detailbook-container">
          <h2>Detaljer for valgt bok: {selectedBook.title} </h2>
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
            {selectedCategory}
          </p>
          <a href={selectedBook.formats["text/html"]} target="_blank">
            Les boken her
          </a>
          <hr />
          <p onClick={() => favourite(selectedBook)} className="favourite">
            <button>Sett favoritt bok</button>
            <img src={favouriteIcon} alt="favoritt ikon" />
          </p>
        </div>
        <img className="hidden" ref={favouriteRef} src={favouriteIcon} />
      </div>
    </>
  );
}
