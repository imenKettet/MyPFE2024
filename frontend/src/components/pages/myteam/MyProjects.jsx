import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { chefService } from "../../../services/chef";
import { CoockieContext } from "../../../features/contexts";
import Modal from 'react-modal';
Modal.setAppElement("*");

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '50%',
    maxHeight: '80%',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
  },
};

const smallScreenStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '70%',
    maxHeight: '80%',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
  },
};
const Myprojects = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [responsiveStyles, setResponsiveStyles] = useState(modalStyles);
  const [projectDetails, setProjectDetails] = useState();

  const [projects, setProjects] = useState([]);
  const Context = useContext(CoockieContext)


  const openModal = async (project) => {
    setProjectDetails(project)


    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setResponsiveStyles(smallScreenStyles);
      } else {
        setResponsiveStyles(modalStyles);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await chefService.getOne(Context.id);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    };
    fetchProjects()
  }, [Context.id]);

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
                <th scope="col">Détails</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td> {index + 1} </td>
                  <td>{project.nameProject}</td>
                  <td>{new Date(project.dateStart).toLocaleDateString()}</td>
                  <td>{new Date(project.dateEnd).toLocaleDateString()}</td>
                  <td>{project.client}</td>
                  <td><button className="btn btn-info"
                    onClick={() => openModal(project)}
                  ><i className="ti ti-info-circle"></i></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveStyles}
        ariaHideApp={false}
        contentLabel="Détail du projet"
      >

        {projectDetails && <div className="m-5">
          <div className="d-flex h5 gap-3">
            <div className="d-flex flex-column gap-3">
              <strong>Nom du projet:</strong>
              <strong>Date début:</strong>
              <strong>Date fin:</strong>
              <strong>Nom du client:</strong>
            </div>

            <div className="d-flex flex-column gap-3">
              <span>{projectDetails.nameProject}</span>
              <span>{projectDetails.dateStart}</span>
              <span>{projectDetails.dateEnd}</span>
              <span>{projectDetails.client}</span>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">N°:</th>
                <th scope="col">Nom de la Tâche</th>
                <th scope="col">Durée estimée</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>{projectDetails.tasks.map((task, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{task.nameTask}</td>
                  <td>{task.estimatedDuration}</td>
                  <td><span className={"badge  " + (task.Status === 'En attente' ? 'text-bg-secondary' : task.Status === 'En cours' ? 'text-bg-info' : 'text-bg-dark')}>{task.Status}</span></td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>}

      </Modal>
    </div>
  );
};

export default Myprojects;
