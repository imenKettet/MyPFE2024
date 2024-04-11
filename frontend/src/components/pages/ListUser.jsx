import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { userService } from "../../services/user";
import { FaSearch } from "react-icons/fa";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchUsers = async () => {
    try {
      const response = await userService.getall();
      setUsers(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des employes:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction pour afficher la boîte de dialogue de confirmation de suppression
  const confirmDelete = (userId) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme la suppression, appeler la fonction pour supprimer le projet
        deleteUser(userId);
      }
    });
  };
  // Fonction pour supprimer un projet
  const deleteUser = async (id) => {
    try {
      await userService.deleteOne(id);
      // Rafraîchir la liste des employés après la suppression
      fetchUsers();
      // Afficher une notification de suppression réussie
      Swal.fire({
        title: "Supprimé !",
        text: "L'employé a été supprimé.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employe:", error);
      // Afficher une notification en cas d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la suppression de l'employé.",
        icon: "error",
      });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredUsers = users.filter((user) => {
  //   return (
  //     user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // });
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <h5 className="fw-semibold "> Liste des employés</h5>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="input-group mb-0 me-5 ms-5">
              <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom, prénom ou email"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FaSearch className="position-absolute top-50 translate-middle-y end-0 me-2" />
            </div>
            <Link to="/AddUser">
              <button
                // style={{
                //   background: "#F27438",
                //   border: "none",
                // }}
                className="btn btn-primary  "
              >
                Ajouter
              </button>
            </Link>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">Nom</th>
                <th scope="col">Prénom</th>
                <th scope="col">téléphone</th>
                <th scope="col">Adresse</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td> {index + 1} </td>
                  <td>{user.lastName}</td>
                  <td>{user.firstName}</td>
                  <td>{user.phone}</td>
                  <td>{user.adress}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <div>
                      <Link to={`/EditUser/${user._id}`}>
                        <i className="ti ti-pencil h3 text-success me-2"></i>
                      </Link>

                      <i
                        className="ti ti-trash h3 text-danger me-2"
                        onClick={() => confirmDelete(user._id)}
                      ></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListUsers;
