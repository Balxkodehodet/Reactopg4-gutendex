import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DetailBook from "./Components/DetailBook.jsx";
import { AppProvider } from "./Components/AppContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Layout from "./Layout.jsx";
import FavouriteBooks from "./Components/FavouriteBooks.jsx";

const categories = [
  "Fiction",
  "Mystery",
  "Thriller",
  "Romance",
  "Fantasy",
  "Morality",
  "Society",
  "Power",
  "Justice",
  "Adventure",
  "Tragedy",
  "War",
  "Philosophy",
];
const router = createBrowserRouter(
  [
    {
      path: "/", // rot
      element: <Layout categories={categories} />, // Layout med header
      children: [
        { index: true, element: <App /> }, // "/" viser Home
        { path: "book/:id", element: <DetailBook /> },
        { path: "FavouriteBooks", element: <FavouriteBooks /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL } // viktig!
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>
);
