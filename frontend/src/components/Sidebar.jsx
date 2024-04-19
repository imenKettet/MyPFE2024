import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; //useLocation est un hook de React Router  pour obtenir l'URL actuelle.

const Sidebar = ({ showSidebarFN, isSidebarOpen }) => {
  const location = useLocation();
  const [role, setRole] = useState("");

  const isLinkActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  useEffect(() => {
    const handleRole = () => {
      setRole(localStorage.getItem("role"));
    };
    handleRole();
  }, []);
  return (
    <aside className="left-sidebar">
      <div className="brand-logo d-flex align-items-center justify-content-between">
        <Link to="/" className="text-nowrap logo-img">
          <img src="/img/logo/logo.png" width="180" alt="logo" />
        </Link>
        <div
          className="close-btn d-xl-none d-block sidebartoggler cursor-pointer"
          id="sidebarCollapse"
          onClick={showSidebarFN}
        >
          <i
            className={`ti ${isSidebarOpen ? "ti-arrow-left" : "ti-x"} fs-8`}
          ></i>
        </div>
      </div>
      <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
        <ul id="sidebarnav">
          <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span className="hide-menu">Home</span>
          </li>
          <li className="sidebar-item">
            <Link
              className={`sidebar-link ${isLinkActive("/")}`}
              to="/"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-layout-dashboard"></i>
              </span>
              <span className="hide-menu">Dashboard</span>
            </Link>
          </li>
          {role === "admin" && (
            <li className="nav-small-cap">
              <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
              <span className="hide-menu">Gestion des projets</span>
            </li>
          )}
          {role === "admin" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/listProjects")}`}
                to="/listProjects"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-article"></i>
                </span>
                <span className="hide-menu">Liste des projets </span>
              </Link>
            </li>
          )}
          {role === "admin" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/listTeams")}`}
                to="/listTeams"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-sitemap"></i>
                </span>
                <span className="hide-menu">Equipes</span>
              </Link>
            </li>
          )}
          {role === "admin" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/affectation")}`}
                to="/affectation"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-typography"></i>
                </span>
                <span className="hide-menu"> Affectation </span>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li className="nav-small-cap">
              <span className="hide-menu h-3">Gestion des employés </span>
            </li>
          )}
          {role === "admin" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/list-users")}`}
                to="/list-users"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-users"></i>
                </span>
                <span className="hide-menu">Liste des employés </span>
              </Link>
            </li>
          )}
          {["admin", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/listAbsences")}`}
                to="/listAbsences"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-float-left"></i>
                </span>
                <span className="hide-menu"> Liste des absences</span>
              </Link>
            </li>
          )}

          {role === "admin" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/listTimeSheet")}`}
                to="listTimeSheet"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-calendar"></i>
                </span>
                <span className="hide-menu">Les feuilles de temps</span>
              </Link>
            </li>
          )}
          {role === "chef" && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/myProjects")}`}
                to="/myProjects"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-article"></i>
                </span>
                <span className="hide-menu"> Mes projets </span>
              </Link>
            </li>

          )}
          {["employe", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/my-team")}`}
                to="/my-team"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-users"></i>
                </span>
                <span className="hide-menu"> Mon équipe </span>
              </Link>
            </li>

          )}
          {["employe", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/myTasks")}`}
                to="/myTasks"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-list-check fs-6"></i>
                </span>
                <span className="hide-menu"> Mes tâches </span>
              </Link>
            </li>
          )}
          {["employe", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("")}`}
                to=""
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-list"></i>
                </span>
                <span className="hide-menu"> Mes Feuilles de temps </span>
              </Link>
            </li>
          )}

          {["employe", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/myAbsences")}`}
                to="/myAbsences"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-float-left"></i>
                </span>
                <span className="hide-menu"> Mes absences </span>
              </Link>
            </li>
          )}

          {["employe", "chef"].includes(role) && (
            <li className="sidebar-item">
              <Link
                className={`sidebar-link ${isLinkActive("/listTimeSheet")}`}
                to="/listTimeSheet"
                aria-expanded="false"
              >
                <span>
                  <i className="ti ti-calendar"></i>
                </span>
                <span className="hide-menu">Feuilles de temps d'équipe</span>
              </Link>
            </li>
          )}
          {/* <li className="sidebar-item">
            <Link
              className={`sidebar-link ${isLinkActive("/tabler-icons")}`}
              to="/tabler-icons"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-mood-happy"></i>
              </span>
              <span className="hide-menu">Icons</span>
            </Link>
          </li> */}
          {/* <li className="sidebar-item">
            <Link
              className={`sidebar-link ${isLinkActive("/sample-page")}`}
              to="/sample-page"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-aperture"></i>
              </span>
              <span className="hide-menu">Sample Page</span>
            </Link>
          </li> */}
          {/* <li className="nav-small-cap">
            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
            <span className="hide-menu">AUTH</span>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/login" aria-expanded="false">
              <span>
                <i className="ti ti-login"></i>
              </span>
              <span className="hide-menu">Login</span>
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/register" aria-expanded="false">
              <span>
                <i className="ti ti-user-plus"></i>
              </span>
              <span className="hide-menu">Register</span>
            </Link>
          </li> */}
          {/* <li className="sidebar-item">
            <Link
              className={`sidebar-link ${isLinkActive("/forms")}`}
              to="/forms"
              aria-expanded="false"
            >
              <span>
                <i className="ti ti-file-description"></i>
              </span>
              <span className="hide-menu">Forms</span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
