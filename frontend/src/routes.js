import { lazy } from "react"; //Importe la fonction lazy de React, qui permet de charger les composants de manière asynchrone.
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const TablerIcons = lazy(() => import("./components/pages/TablerIcons"));
const SamplePage = lazy(() => import("./components/pages/SamplePage"));
const Forms = lazy(() => import("./components/pages/Forms"));
const listProjects = lazy(() => import("./components/pages/ListProjects"));
const listUsers = lazy(() => import("./components/pages/ListUser"));
const listTeams = lazy(() => import("./components/pages/ListTeams"));
const listAbsences = lazy(() => import("./components/pages/ListAbsences"));
const listTimeSheet = lazy(() => import("./components/pages/ListTimeSheet"));
const addProject = lazy(() => import("./components/pages/AddProject"));
const addUser = lazy(() => import("./components/pages/AddUser"));
const addTeam = lazy(() => import("./components/pages/AddTeam"));
const addAbsence = lazy(() => import("./components/pages/AddAbsence"));
const editProject = lazy(() => import("./components/pages/EditProject"));
const editUser = lazy(() => import("./components/pages/EditUser"));
const editTeam = lazy(() => import("./components/pages/EditTeam"));
const myTasks = lazy(() => import("./components/pages/MyTasks"));
const myProjects = lazy(() => import("./components/pages/MyProjects"));
const myAbsences = lazy(() => import("./components/pages/MyAbsences"));
const affectation = lazy(() => import("./components/pages/Affectation"));
const affectedTasks = lazy(() => import("./components/pages/AffectedTasks"));

const routes = [
  {
    path: "/", //path spécifie l'URL correspondante
    element: Dashboard, // element spécifie le composant à afficher
    name: "Dashboard", //name est un nom donné à la route
    exact: true, //indique que l'URL doit correspondre exactement à path.
  },

  {
    path: "/listProjects",
    element: listProjects,
    name: "listProjects",
    exact: true,
  },
  {
    path: "/listTeams",
    element: listTeams,
    name: "listTeams",
    exact: true,
  },
  {
    path: "/listUsers",
    element: listUsers,
    name: "listUsers",
    exact: true,
  },
  {
    path: "/listAbsences",
    element: listAbsences,
    name: "listAbsences",
    exact: true,
  },
  {
    path: "/listTimeSheet",
    element: listTimeSheet,
    name: "listTimeSheet",
    exact: true,
  },
  {
    path: "/addProject",
    element: addProject,
    name: "addProject",
    exact: true,
  },
  {
    path: "/addUser",
    element: addUser,
    name: "addUser",
    exact: true,
  },
  {
    path: "/addTeam",
    element: addTeam,
    name: "addTeam",
    exact: true,
  },
  {
    path: "/addAbsence",
    element: addAbsence,
    name: "addAbsence",
    exact: true,
  },

  {
    path: "/editProject/:id",
    element: editProject,
    name: "editProject",
    exact: true,
  },

  {
    path: "/editTeam/:id",
    element: editTeam,
    name: "editTeam",
    exact: true,
  },

  {
    path: "/editUser/:id",
    element: editUser,
    name: "editUser",
    exact: true,
  },
  {
    path: "/affectation",
    element: affectation,
    name: "affectation",
    exact: true,
  },

  {
    path: "/myTasks",
    element: myTasks,
    name: "myTasks",
    exact: true,
  },

  {
    path: "/myAbsences",
    element: myAbsences,
    name: "myAbsences",
    exact: true,
  },

  {
    path: "/myProjects",
    element: myProjects,
    name: "myProjects",
    exact: true,
  },
  {
    path: "/affectedTasks",
    element: affectedTasks,
    name: "affectedTasks",
    exact: true,
  },

  {
    path: "/tabler-icons",
    element: TablerIcons,
    name: "TablerIcons",
    exact: true,
  },

  {
    path: "/sample-page",
    element: SamplePage,
    name: "SamplePage",
    exact: true,
  },
  {
    path: "/forms",
    element: Forms,
    name: "Forms",
    exact: true,
  },
];

export default routes;
