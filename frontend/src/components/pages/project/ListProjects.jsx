import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { projectService } from "../../../services/project";

const ListProjects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const fetchProjects = async () => {
    try {
      const response = await projectService.getall();
      setProjects(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fonction pour afficher la boîte de dialogue de confirmation de suppression
  const confirmDelete = (projectId) => {
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
        deleteProject(projectId);
      }
    });
  };
  // Fonction pour supprimer un projet
  const deleteProject = async (id) => {
    try {
      await projectService.deleteOne(id);
      // Rafraîchir la liste des projets après la suppression
      fetchProjects();
      // Afficher une notification de suppression réussie
      Swal.fire({
        title: "Supprimé !",
        text: "Votre projet a été supprimé.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      // Afficher une notification en cas d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la suppression du projet.",
        icon: "error",
      });
    }
  };
  //fonction pour afficher les détails d'un projet :
  const showProjectDetails = (project) => {
    setSelectedProject(project);
    // Construire une chaîne HTML pour afficher les détails du projet
    let projectDetailsHTML = `
      <div>
        <p><strong>Nom du Projet:</strong> ${project.nameProject}</p>
        <p><strong>Date de Début:</strong> ${new Date(
      project.dateStart
    ).toLocaleDateString()}</p>
        <p><strong>Date de Fin:</strong> ${new Date(
      project.dateEnd
    ).toLocaleDateString()}</p>
        <p><strong>Client:</strong> ${project.client}</p>
      </div>
    `;

    // Vérifier si le projet a des tâches
    if (project.tasks && project.tasks.length > 0) {
      // Ajouter une section pour afficher les tâches
      projectDetailsHTML += `
      <div>
      <p><strong>Tâches du Projet:</strong></p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Nom de la Tâche</th>
            <th scope="col">Durée estimée</th>
          </tr>
        </thead>
        <tbody>
  `;

      // Ajouter chaque tâche à la liste
      project.tasks.forEach((task) => {
        projectDetailsHTML += `<tr>
        <td>${task.nameTask}</td>
        <td>${task.estimatedDuration} heures</td>
      </tr>`;
      });

      projectDetailsHTML += `</tbody>
      </table>
    </div>`;
    }

    // Afficher les détails du projet avec les tâches
    Swal.fire({
      title: "Détails du Projet",
      html: projectDetailsHTML,
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
            <h5 className="fw-semibold text-center "> Liste des projets </h5>
            <Link to="/AddProject">
              <button
                className="btn btn-primary  "
              // style={{
              //   background: "#e76f51",
              //   border: "none",
              // }}
              >
                Ajouter
              </button>
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">Nom du Projet</th>
                <th scope="col">Date_Début</th>
                <th scope="col">Date_Fin</th>
                <th scope="col">Client</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <td> {index + 1} </td>
                  <td>{project.nameProject}</td>
                  <td>{new Date(project.dateStart).toLocaleDateString()}</td>
                  <td>{new Date(project.dateEnd).toLocaleDateString()}</td>
                  <td>{project.client}</td>
                  <td>
                    <div>
                      <Link to={`/EditProject/${project._id}`}>
                        <i className="cursor-pointer ti ti-pencil h3 text-success me-2"></i>
                      </Link>

                      <i
                        className="cursor-pointer ti ti-trash h3 text-danger me-2"
                        onClick={() => confirmDelete(project._id)}
                      ></i>
                      <i
                        className="cursor-pointer ti ti-alert-circle h3 "
                        onClick={() => showProjectDetails(project)}
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

export default ListProjects;