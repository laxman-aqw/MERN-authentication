import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Profile } from "./components/Profile";
import { Register } from "./components/Register";
import { Reset } from "./components/Reset";
import { Recovery } from "./components/Recovery";
import { Password } from "./components/Password";
import { Username } from "./components/Username";
import { PageNotFound } from "./components/PageNotFound";

import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "/recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password></Password>,
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile></Profile>
      </AuthorizeUser>
    ),
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
