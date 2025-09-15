import { useEffect, useState, useContext, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "./Components/AppContext.jsx";

export default function Layout({ categories = [] }) {
  // globale useContext props og hooks
  const {
    setSelectedCategory,
    setSearchResults,
    nextButtonClicked,
    setNextButtonClicked,
    nextPage,
    page,
    setPage,
    loading,
    prevPage,
    setPrevButtonClicked,
    prevButtonClicked,
    isHomePage,
    setIsHomePage,
    isModalOpen,
    setIsModalOpen,
    query,
    setQuery,
  } = useContext(AppContext);

  // Hooks
  const [open, setOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const dialogRef = useRef(null);
  const modalDropdownRef = useRef(null);
  const modalBtnRef = useRef(null);
  const navigate = useNavigate();

  // Meny modal
  // To forskjellige useEffect for desktop versjon av meny og mobil versjon
  // Det ble bare tull når begge var i samme
  // Desktop useEffect for meny dropdown og klikk utenfor meny

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function handleClickOutside(e) {
      if (!open) return; // gjør ingenting hvis dropdown ikke er åpen

      const target = e.target;

      // Desktop dropdown
      const clickedInsideDropdown =
        desktopDropdownRef.current &&
        desktopDropdownRef.current.contains(target);

      // Hvis vi er utenfor mobil versjon og klikket er verken på dropdown eller kategoriknappen -> lukk
      if (window.innerWidth > 450) {
        if (open && !clickedInsideDropdown) {
          setOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  // useEffect for mobil versjon (modal) versjonen av meny
  // Hvis klikk utenfor kategori legg ned kategori,
  // Hvis klikk utenfor meny legg ned meny
  useEffect(() => {
    function handleClickOutside(e) {
      if (!isModalOpen) return; // gjør ingenting hvis dropdown ikke er åpen

      const target = e.target;
      // Modal dropdown
      const clickedModalDropdown =
        modalDropdownRef.current && modalDropdownRef.current.contains(target);
      const clickedDialog =
        dialogRef.current && dialogRef.current.contains(target);
      const clickedModalBtn =
        modalBtnRef.current && modalBtnRef.current.contains(target);

      if (window.innerWidth < 450) {
        if (isModalOpen && !clickedDialog) {
          setIsModalOpen(false);
          setOpen(false);
        }
        if (isModalOpen && !clickedModalDropdown) {
          setOpen(false);
        }
        if (isModalOpen && clickedModalBtn) {
          setIsModalOpen(false);
        }
      }
    }
    document.addEventListener("clicked", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("clicked", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Funksjon for å toggle å vise kategorier i menyen
  function showCategories() {
    setOpen((prev) => !prev);
  }
  // Når kategori blir klikket
  function categoryClick(category) {
    console.log("CategoryClick:", category);
    setSelectedCategory(category);
    setPage(1);
    setSearchResults("");
    navigate("/");
    setOpen(false);
    setIsModalOpen(false);
  }
  // funksjon for å takle søk etter bøker
  function handleSearch(e) {
    e.preventDefault();
    console.log("You searched for: ", query);
    setSelectedCategory(null); // Sørg for at kategori ikke blokkerer søket
    setOpen(false); // Lukk dropdown menyen hvis den er åpen
    setPage(1); // Reset siden til side 1 når et nytt søk blir gjort

    //Force en state change
    setSearchResults("");
    setTimeout(() => {
      setSearchResults(query);
    }, 0);
    navigate("/"); // Naviger til hjem-siden for å vise søkeresultater
  }
  //Funksjon for å takle neste side
  function handleNextPage() {
    setNextButtonClicked(true);
    console.log("Next button clicked: ", nextButtonClicked);
    console.log("Fetching next page...", nextPage);
    if (loading === false) {
      navigate("/"); // Naviger til hjem-siden for å vise søkeresultater
      setPage((prev) => prev + 1);
    }
  }
  // Funksjon for å takle forrige side
  function handlePrevPage() {
    setPrevButtonClicked(true);
    console.log("prev button clicked", prevButtonClicked);
    console.log("Fetching Previous Page", prevPage);
    if (loading === false) {
      navigate("/"); // Naviger til hjem-siden for å vise søkeresultater
      setPage((prev) => prev - 1);
    }
  }

  function homeIsFalse() {
    setIsHomePage(false);
  }
  function homeIsTrue() {
    setIsHomePage(true);
    setPage(1); // Reset siden til side 1 når hjemmeside knappen blir trykket for å resette
  }
  function modalHandler() {
    if (isModalOpen) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
  }
  return (
    <>
      <header>
        <button
          type="button"
          ref={modalBtnRef}
          className="modalBtn"
          onClick={modalHandler}
        >
          {isModalOpen ? "Lukk Meny" : "Åpne meny"}
        </button>
        {isModalOpen && (
          <dialog ref={dialogRef} className="dialog-modalBtn" open>
            <nav>
              <ul>
                <li>
                  <Link to="/" onClick={homeIsTrue}>
                    <button type="button">Home</button>
                  </Link>
                </li>
                <li>
                  <Link to="/Credits" onClick={homeIsFalse}>
                    <button>Credits</button>
                  </Link>
                </li>
                <li>
                  <Link to="/FavouriteBooks" onClick={homeIsFalse}>
                    <button>Vis favoritt bøker</button>
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={homeIsTrue}>
                    <button type="button" onClick={() => showCategories()}>
                      Kategorier
                    </button>
                  </Link>
                  <ul
                    id="modal-dropdown"
                    ref={modalDropdownRef}
                    className={open ? "dropdown" : "hidden"}
                  >
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          type="button"
                          onClick={() => categoryClick(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </dialog>
        )}
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/" onClick={homeIsTrue}>
                <button>Home</button>
              </Link>
            </li>
            <li>
              <Link to="/Credits" onClick={homeIsFalse}>
                <button>Credits</button>
              </Link>
            </li>
            <li>
              <Link to="/FavouriteBooks" onClick={homeIsFalse}>
                <button>Vis favoritt bøker</button>
              </Link>
            </li>
            <li>
              <Link to="/" onClick={homeIsTrue}>
                <button type="button" onClick={() => showCategories()}>
                  Kategorier
                </button>
              </Link>
              <ul
                id="dropdown"
                ref={desktopDropdownRef}
                className={open ? "dropdown" : "hidden"}
              >
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => categoryClick(category)}
                    >
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
          <button type="submit">Søk</button>
        </form>
        <div className="buttonContainer">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={!isHomePage || !prevPage || loading}
          >
            Forrige side
          </button>
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!isHomePage || !nextPage || loading}
          >
            Neste side
          </button>
          <p className="page">side : {page}</p>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
