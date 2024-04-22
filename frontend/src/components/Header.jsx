import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { deleteCookie } from "../utils/functions";
import { CoockieContext } from "../features/contexts";
import { notificationService } from "../services/notification";

const Header = ({ showSidebarFN }) => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BASE_URL + "/auth/logout");
      toast.success(response.data.message);
      navigate('/login')
      deleteCookie('token')
    } catch (error) {
      console.log(error);
    }
  };

  const [notifications, setNotifications] = useState([]);
  const Context = useContext(CoockieContext);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getAll();
        setNotifications(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications()
  }, [Context.id]);
  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item d-block d-xl-none">
            <div
              className="nav-link sidebartoggler nav-icon-hover"
              id="headerCollapse"
              onClick={showSidebarFN}
            >
              <i className="ti ti-menu-2"></i>
            </div>
          </li>
          {localStorage.getItem('role') === 'admin' && (
            <li className="nav-item p-0">
              <Link to='/notifications' className="nav-link nav-icon-hover position-relative">
                <i className="ti ti-bell-ringing"></i>
                <span className="position-absolute  translate-middle p-1 badge rounded-pill bg-danger" style={{ left: '44px' }}>
                  {notifications.filter((notification) => !notification.viewed).length}
                </span>
              </Link>
            </li>
          )}
        </ul>
        <div
          className="navbar-collapse justify-content-end px-0"
          id="navbarNav"
        >
          <ul className="navbar-nav flex-row ms-auto align-items-center justify-content-end">
            <li>{`{${localStorage.getItem('role').toUpperCase()}}`}</li>
            <li className="nav-item dropdown">
              <div
                className="nav-link nav-icon-hover"
                id="drop2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/img/profile/user-1.jpg"
                  alt=""
                  width="35"
                  height="35"
                  className="rounded-circle"
                />
              </div>
              <div
                className="dropdown-menu dropdown-menu-end dropdown-menu-animate-up"
                aria-labelledby="drop2"
              >
                <div className="message-body">
                  <Link to={"/profile"}>
                    <div className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-user fs-6"></i>
                      <p className="mb-0 fs-3"> Mon Profil</p>
                    </div>
                  </Link>
                  {localStorage.getItem('role') !== 'admin' && <Link to={"/myTasks"}>
                    <div className="d-flex align-items-center gap-2 dropdown-item">
                      <i className="ti ti-list-check fs-6"></i>
                      <p className="mb-0 fs-3">Mes tâches</p>
                    </div>
                  </Link>}

                  <button
                    onClick={logout}
                    className="btn btn-outline-primary mx-3 mt-2 d-block "
                    style={{
                      margin: "0 auto",
                      display: "block",
                      width: "200px",
                    }}
                  >
                    Déconnecter
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
