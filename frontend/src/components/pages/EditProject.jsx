import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { projectService } from "../../services/project";

const EditProject = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [project, setproject] = useState();
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    setTasks([...tasks, { nameTask: "", estimatedDuration: "" }]);
  };
  // Fonction pour supprimer une tâche par son index
  const deleteTask = (indexToRemove) => {
    setTasks((prevTasks) =>
      prevTasks.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getOne(id);
        setTasks(response.data.tasks);
        setproject(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProject();
  }, [id]);

  // Fonction pour afficher la confirmation avant d'enregistrer les modifications
  const confirmSaveChanges = () => {
    return Swal.fire({
      title: "Voulez-vous enregistrer les modifications?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: `Non`,
    });
  };
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={
              project || {
                nameProject: "",
                client: "",
                dateStart: "",
                dateEnd: "",
              }
            }
            onSubmit={async (values) => {
              try {
                const shouldSave = await confirmSaveChanges();
                if (shouldSave.isConfirmed) {
                  let project = { ...values, tasks };
                  const response = await projectService.updateOne(id, project);
                  toast.success(response.data.message);
                  Navigate("/ListProjects");
                } else if (shouldSave.isDenied) {
                  Navigate("/ListProjects");
                }
              } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                  toast.error(error.response.data.message);
                }
              }
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Nom du projet
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nameProject"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nameProject}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Client
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="client"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.client}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date_Début
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateStart"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dateStart}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date_Fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateEnd"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.dateEnd}
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <label htmlFor="tasks" className="form-label">
                      Tâches :
                    </label>
                    {/* Bouton pour ajouter une nouvelle tâche */}
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={addTask}
                    >
                      Ajouter une tâche
                    </button>
                  </div>

                  {tasks.map((task, index) => (
                    <div key={index} className="input-group mb-3">
                      <input
                        type="text"
                        name="nameTask"
                        className="form-control"
                        placeholder="Nom de la tâche"
                        value={task.nameTask}
                        onChange={(e) => {
                          const newTasks = [...tasks];
                          newTasks[index].nameTask = e.target.value;
                          setTasks(newTasks);
                        }}
                      />
                      <input
                        type="text"
                        className="form-control"
                        name="estimatedDuration"
                        placeholder="Durée estimée"
                        value={task.estimatedDuration}
                        onChange={(e) => {
                          const newTasks = [...tasks];
                          newTasks[index].estimatedDuration = e.target.value;
                          setTasks(newTasks);
                        }}
                      />
                      <button
                        type="submit"
                        className="btn btn-danger"
                        onClick={() => deleteTask(index)}
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary py-8 fs-4 mb-4 rounded-2"
                  disabled={isSubmitting}
                  style={{
                    margin: "0 auto",
                    display: "block",
                    width: "200px",
                  }}
                >
                  Valider
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
