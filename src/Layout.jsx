import { useEffect, useState, useContext, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppContext } from "./Components/AppContext.jsx";

export default function Layout({ categories = [] }) {
  // useContext props
  const { setSelectedCategory, setSearchResults } = useContext(AppContext);

  // Hooks
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);
  // Funksjon for å toggle å vise kategorier i menyen
  function showCategories() {
    setOpen((prev) => !prev);
  }
  // funksjon for å takle søk etter bøker
  function handleSearch(e) {
    e.preventDefault();
    setSearchResults(query);
    console.log("You searched for: ", query);
  }
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <button>Home</button>
              </Link>
            </li>
            <li>
              <Link to="/FavouriteBooks">
                <button>Vis favoritt bøker</button>
              </Link>
            </li>
            <li>
              <Link to="/">
                <button onClick={() => showCategories()}>Kategorier</button>
              </Link>
              <ul
                id="dropdown"
                ref={dropdownRef}
                className={open ? "dropdown" : "hidden"}
              >
                {categories.map((category) => (
                  <li key={category}>
                    <button onClick={() => setSelectedCategory(category)}>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
        <form onSubmit={handleSearch} className="search-form">
          <label htmlFor="search-books">Søk etter bøker her: </label>
          <input
            id="search-books"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Søk etter bøker..."
          />
          {/* <Link to="/"> */}
          <button type="submit">Søk</button>
          {/* </Link> */}
        </form>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
