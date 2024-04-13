import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { projectService } from "../../../services/project";

const AddProject = () => {
  const Navigate = useNavigate();

  const initialValues = {
    nameProject: "",
    client: "",
    dateStart: "",
    dateEnd: "",
    tasks: [{ nameTask: "", estimatedDuration: "" }]
  };


  const validationSchema = Yup.object().shape({
    nameProject: Yup.string().required('Nom du projet est obligatoire'),
    client: Yup.string().required('Nom du client est obligatoire'),
    dateStart: Yup.date().required('Date début obligatoire'),
    dateEnd: Yup.date().required('Date fin obligatoire'),
    tasks: Yup.array().of(
      Yup.object().shape({
        nameTask: Yup.string().required('Nom tache obligatoire'),
        estimatedDuration: Yup.string().required('Date durée estimation obligatoire')
      })
    )
  });
  const addTask = (values, setValues) => {
    setValues({ ...values, tasks: [...values.tasks, { nameTask: "", estimatedDuration: "" }] });
  };
  const deleteTask = (index, values, setValues) => {
    const newTasks = [...values.tasks];
    newTasks.splice(index, 1);
    setValues({ ...values, tasks: newTasks });
  };

  return (
    <div className="container-fluid ">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}

            onSubmit={async (values) => {
              try {
                let project = { ...values };
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
              setValues
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
                    <button type="button" className="btn btn-primary" onClick={() => addTask(values, setValues)}>Ajouter une tâche</button>
                  </div>

                  {values.tasks.map((task, index) => (
                    <div key={index} className="input-group mb-3">
                      <div className="col-4 me-2">
                        <Field
                          type="text"
                          name={`tasks.${index}.nameTask`}
                          className="form-control"
                          placeholder="Nom de la tâche"
                        />
                        <ErrorMessage name={`tasks.${index}.nameTask`} component="span" className="text-danger" /></div>
                      <div className="col-4 me-2">
                        <Field
                          type="number"
                          min="1"
                          name={`tasks.${index}.estimatedDuration`}
                          className="form-control"
                          placeholder="Durée estimée"
                        />
                        <ErrorMessage name={`tasks.${index}.estimatedDuration`} component="span" className="text-danger" />
                      </div>
                      <div>
                        {values.tasks.length !== 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => deleteTask(index, values, setValues)}
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        )}
                      </div>
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