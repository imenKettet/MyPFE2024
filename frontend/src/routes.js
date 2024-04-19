import { lazy } from "react"; //Importe la fonction lazy de React, qui permet de charger les composants de manière asynchrone.
const Dashboard = lazy(() => import("./components/pages/Dashboard"));
const TablerIcons = lazy(() => import("./components/pages/TablerIcons"));
const SamplePage = lazy(() => import("./components/pages/SamplePage"));
const Forms = lazy(() => import("./components/pages/Forms"));
const listProjects = lazy(() => import("./components/pages/project/ListProjects"));
const listUsers = lazy(() => import("./components/pages/user/ListUser"));
const listTeams = lazy(() => import("./components/pages/team/ListTeams"));
const listAbsences = lazy(() => import("./components/pages/absence/ListAbsences"));
const listTimeSheet = lazy(() => import("./components/pages/ListTimeSheet"));
const Notifications = lazy(() => import("./components/pages/Notifications"));
const addProject = lazy(() => import("./components/pages/project/AddProject"));
const addUser = lazy(() => import("./components/pages/user/AddUser"));
const addTeam = lazy(() => import("./components/pages/team/AddTeam"));
const addAbsence = lazy(() => import("./components/pages/absence/AddAbsence"));
const UpdateAbsence = lazy(() => import("./components/pages/absence/UpdateAbsence"));
const editProject = lazy(() => import("./components/pages/project/EditProject"));
const editUser = lazy(() => import("./components/pages/user/EditUser"));
const editTeam = lazy(() => import("./components/pages/team/EditTeam"));
const myTasks = lazy(() => import("./components/pages/myteam/MyTasks"));
const MyTeam = lazy(() => import("./components/pages/myteam/MyTeam"));
const FillingMyTask = lazy(() => import("./components/pages/myteam/FillingMyTask"));
const myProjects = lazy(() => import("./components/pages/myteam/MyProjects"));
const Profile = lazy(() => import("./components/pages/profile/MyProfile"));
const myAbsences = lazy(() => import("./components/pages/absence/MyAbsences"));
const AffectationProjectToTeam = lazy(() => import("./components/pages/affectation/AffectationProjectToTeam"));
const AffectTasks = lazy(() => import("./components/pages/affectation/AffectTasks"));
const MyTimeSheetList = lazy(() => import("./components/pages/MyListTimeSheet"));
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
    path: "/list-users",
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
    path: "/myTimeSheetList",
    element: MyTimeSheetList,
    name: "myTimeSheetList",
    exact: true,
  },
  {
    path: "/notifications",
    element: Notifications,
    name: "notifications",
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
    path: "/editAbsence/:id",
    element: UpdateAbsence,
    name: "UpdateAbsence",
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
    path: "/edit-user/:id",
    element: editUser,
    name: "editUser",
    exact: true,
  },
  {
    path: "/affectation",
    element: AffectationProjectToTeam,
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
    path: "/my-team",
    element: MyTeam,
    name: "My team",
    exact: true,
  },
  {
    path: "/affect-tasks/:id",
    element: AffectTasks,
    name: "Affect Tasks",
    exact: true,
  },

  {
    path: "/myTasks/:id",
    element: FillingMyTask,
    name: "Filling my lask",
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
    path: "/profile",
    element: Profile,
    name: "Profile",
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
