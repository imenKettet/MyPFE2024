import "./App.css";
import "./assets/css/styles.min.css";
import "./assets/scss/styles.scss";
import "animate.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./routes";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import { CoockieContext } from "./features/contexts";
import { decodeToken, getCookie } from './utils/functions';

const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./components/auth/Login"));
const Register = lazy(() => import("./components/auth/Register"));
const ForgotPassword = lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/auth/ResetPassword"));

const Loading = (
  <div className="d-flex justify-content-center vh-100 align-items-center">
    <div className="spinner-grow text-info" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
const routing = routes.map((route) => {
  // crée une nouvelle variable routing en parcourant chaque objet de la configuration des routes (routes)..
  return (
    route.element && {
      path: route.path,
      element: <route.element />,
      exact: route.exact,
      name: route.name,
    }
  );
});
const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/ForgotPassword",
    element: <ForgotPassword />,
    name: "ForgotPassword",
    exact: true,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
    name: "ResetPassword",
    exact: true,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: routing,
  },
]);
function App() {
  const token = decodeToken(getCookie('token')) || {}

  return (
    <div>
      <Toaster />
      <CoockieContext.Provider value={token}>
        <Suspense fallback={Loading}>
          <RouterProvider router={router} fallbackElement={Loading} />
        </Suspense>
      </CoockieContext.Provider>
    </div>
  );
}
//Suspense. Il permet de gérer le chargement de composants de manière asynchrone. Pendant que les composants sont en cours de chargement,
// le composant spécifié dans la prop fallback sera affiché. Dans ce cas, le composant Loading est utilisé comme indicateur de chargement
export default App;
