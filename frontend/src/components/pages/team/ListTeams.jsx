import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { teamService } from "../../../services/team";

const ListTeams = () => {
  const [teams, setTeams] = useState([]);
  // Fetch all teams from the server when the component mounts
  const fetchTeams = async () => {
    try {
      const response = await teamService.getall();
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Inline styles for the card
  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  // Fonction pour afficher la boîte de dialogue de confirmation de suppression
  const confirmDelete = (teamId) => {
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
        // Si l'utilisateur confirme la suppression, appeler la fonction pour supprimer l'equipe
        deleteTeam(teamId);
      }
    });
  };
  // Fonction pour supprimer une équipe
  const deleteTeam = async (id) => {
    try {
      await teamService.deleteOne(id);
      // Rafraîchir la liste des d'equipe après la suppression
      fetchTeams();
      // Afficher une notification de suppression réussie
      Swal.fire({
        title: "Supprimé !",
        text: "L'équipe a été supprimé.",
        icon: "success",
        showClass: {
          popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
        }
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'équipe:", error);
      // Afficher une notification en cas d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la suppression de l'équipe.",
        icon: "error",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    }
  };

  //fonction pour afficher les détails d'un equipe :
  const showTeamDetails = (team) => {
    console.log(team);
    // Construire une chaîne HTML pour afficher les détails du l'equipe
    let TeamDetailsHTML = `
      <div>
        <p><strong>Nom du l'équipe:</strong> ${team.teamName}</p>
        <p><strong>Chef d'equipe:</strong> ${team.chef.firstName} ${team.chef.lastName}</p>
        <p><strong>Membres:</strong> ${team.employees.map((em) => {
      return (
        `<span class="badge bg-light text-dark">${em.firstName} ${em.lastName}</span>`
      )
    })}</p>
      </div>
    `;

    // Vérifier si l'équipe a des projets
    if (team.projects && team.projects.length > 0) {
      // Ajouter une section pour afficher les projets
      TeamDetailsHTML += `
      <div>
      <p><strong> les projets :</strong></p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Nom de la projet</th>
            <th scope="col">Date Debut</th>
            <th scope="col">Date Fin</th>
          </tr>
        </thead>
        <tbody>
  `;

      // Ajouter chaque tâche à la liste
      team.projects.forEach((project) => {
        TeamDetailsHTML += `<tr>
        <td>${project.nameProject}</td>
        <td>${new Date(project.dateStart).toLocaleDateString()} </td>
        <td>${new Date(project.dateEnd).toLocaleDateString()} </td>
      </tr>`;
      });

      TeamDetailsHTML += `</tbody>
      </table>
    </div>`;
    }

    // Afficher les détails du projet avec les tâches
    Swal.fire({
      title: "Détails de l'équipe",
      html: TeamDetailsHTML,
      confirmButtonText: "Fermer",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold text-center ">Les équipes</h5>
            <Link to="/AddTeam">
              <button className="btn btn-primary">Ajouter</button>
            </Link>
          </div>
          <div className="row">
            {teams.map((team) => (
              <div key={team._id} className="col-md-4 mb-4">
                <div className="card" style={cardStyle}>
                  <div className="card-body">
                    <h5 className="card-title text-center mb-4 ">
                      {team.teamName}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      <strong>Chef d'équipe:</strong>
                      {team.chef
                        ? `${team.chef.firstName} ${team.chef.lastName}`
                        : "N/A"}
                    </h6>
                    <strong className="card-text">Membres de l'équipe:</strong>
                    <ul>
                      {team.employees.map((employee) => (
                        <li key={employee._id}>
                          {employee.firstName} {employee.lastName}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 text-center ">
                      <Link to={`/EditTeam/${team._id}`}>
                        <i className="ti ti-pencil h3 text-success me-2"></i>
                      </Link>
                      <i
                        className="ti ti-trash h3 text-danger me-2"
                        onClick={() => confirmDelete(team._id)}
                      ></i>
                      <i
                        className="ti ti-alert-circle h3 "
                        onClick={() => showTeamDetails(team)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListTeams;
