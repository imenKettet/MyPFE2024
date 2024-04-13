import React from "react";
import { useState, useEffect } from "react";
import { teamService } from "../../../services/team";

const Myprojects = () => {
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      const response = await teamService.getdetails();
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <h5 className="fw-semibold text-center "> Liste des projets </h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">Nom du Projet</th>
                <th scope="col">Date_Début</th>
                <th scope="col">Date_Fin</th>
                <th scope="col">Client</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Myprojects;
