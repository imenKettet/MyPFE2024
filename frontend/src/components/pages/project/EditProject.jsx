import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { projectService } from "../../../services/project";
import PageContainer from "../../reusedComponents/PageContainer";

const EditProject = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [project, setproject] = useState();
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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getOne(id);
        setproject(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProject();
  }, [id]);

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
    <PageContainer title='Modifier un projet' path='/listProjects' btnColor="dark" btntxt='Retour' >

      <Formik
        initialValues={
          project || initialValues
        }
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            const shouldSave = await confirmSaveChanges();
            if (shouldSave.isConfirmed) {
              let project = { ...values };
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
          setValues
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
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.dateEnd}
              />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label htmlFor="tasks" className="form-label me-3">
                    Tâches :
                  </label>
                  {/* Bouton pour ajouter une nouvelle tâche */}
                  <button type="button" className="btn btn-primary" onClick={() => addTask(values, setValues)}>Ajouter un tâche</button>
                </div>
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
    </PageContainer>
  );
};

export default EditProject;
