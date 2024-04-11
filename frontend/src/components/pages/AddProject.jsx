import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { projectService } from "../../services/project";
import { useState } from "react";

const AddProject = () => {
  const Navigate = useNavigate();
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
  return (
    <div className="container-fluid ">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={{
              nameProject: "",
              client: "",
              dateStart: "",
              dateEnd: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.nameProject) {
                errors.nameProject = "Requis";
              }
              if (!values.client) {
                errors.client = "Requis";
              }
              if (!values.dateStart) {
                errors.dateStart = "Requis";
              }
              if (!values.dateEnd) {
                errors.dateEnd = "Requis";
              }

              return errors;
            }}
            onSubmit={async (values) => {
              try {
                let project = { ...values, tasks };
                const response = await projectService.addOne(project);
                toast.success(response.data.message);
                Navigate("/ListProjects");
              } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                  toast.error(error.response.data.message);
                }
              }
            }}
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
                  <h4 className=" text-center fw-bolder">Nouveau Projet</h4>
                  <label htmlFor="nameProject" className="form-label">
                    Nom du projet
                  </label>
                  <input
                    id="nameProject"
                    type="text"
                    className="form-control"
                    name="nameProject"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.nameProject &&
                      touched.nameProject &&
                      errors.nameProject}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clinet" className="form-label">
                    Client
                  </label>
                  <input
                    id="clinet"
                    type="text"
                    className="form-control"
                    name="client"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.client && touched.client && errors.client}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dateStart" className="form-label">
                    Date_Début
                  </label>
                  <input
                    id="dateStart"
                    type="date"
                    className="form-control"
                    name="dateStart"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.dateStart && touched.dateStart && errors.dateStart}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dateEnd" className="form-label">
                    Date_Fin
                  </label>
                  <input
                    id="dateEnd"
                    type="date"
                    className="form-control"
                    name="dateEnd"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.dateEnd && touched.dateEnd && errors.dateEnd}
                  </div>
                </div>
                <hr />
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
                  className="btn btn-primary  py-8 fs-4 mb-4 rounded-2"
                  disabled={isSubmitting}
                  style={{
                    margin: "0 auto",
                    display: "block",
                    width: "200px",
                  }}
                >
                  Enregistrer
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddProject;

// import { CgAddR } from "react-icons/cg";
// import { Link } from "react-router-dom";
/* //     <div className="container">
//       <h2>Ajouter un Projet</h2>
//       <form>
//         <div className="form-group">
//           <label>Nom:</label>
//           <input type="text" className="form-control" name="nom" />
//         </div>
//         <div className="form-group">
//           <label>Date de début:</label>
//           <input type="date" className="form-control" name="dateDebut" />
//         </div>
//         <div className="form-group">
//           <label>Date de fin:</label>
//           <input type="date" className="form-control" name="dateFin" />
//         </div>
//         <div className="form-group">
//           <label>Client:</label>
//           <input type="text" className="form-control" name="client" />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           Ajouter Projet
//         </button>
//       </form>
//     </div>

//   );
// }; */

/* 
// // <div className="container-fluid">
// //     <div className="container-fluid">
// //         <div className="card">
// //             <div className="card-body">
// //                 <h5 className="card-title fw-semibold mb-4">Alerts</h5>
// //                 <div className="card mb-0">
// //                     <div className="card-body p-4">
// //                         <div className="alert alert-primary" role="alert">
// //                             A simple primary alert—check it out!
// //                         </div>
// //                         <div className="alert alert-secondary" role="alert">
// //                             A simple secondary alert—check it out!
// //                         </div>
// //                         <div className="alert alert-success" role="alert">
// //                             A simple success alert—check it out!
// //                         </div>
// //                         <div className="alert alert-danger" role="alert">
// //                             A simple danger alert—check it out!
// //                         </div>
// //                         <div className="alert alert-warning" role="alert">
// //                             A simple warning alert—check it out!
// //                         </div>
// //                         <div className="alert alert-info" role="alert">
// //                             A simple info alert—check it out!
// //                         </div>
// //                         <div className="alert alert-light" role="alert">
// //                             A simple light alert—check it out!
// //                         </div>
// //                         <div className="alert alert-dark" role="alert">
// //                             A simple dark alert—check it out!
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     </div>
// // </div> */
