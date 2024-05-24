import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { projectService } from "../../../services/project";
import PageContainer from "../../reusedComponents/PageContainer";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";

const EditProject = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [project, setproject] = useState();
  const [projectStatus, setProjectStatus] = useState("");
  const initialValues = {
    nameProject: "",
    client: "",
    dateStart: "",
    dateEnd: "",
    tasks: [{ nameTask: "", estimatedDuration: "" }],
  };
  const validationSchema = Yup.object().shape({
    nameProject: Yup.string()
      .required("Nom du projet est obligatoire")
      .max(10, "Le nom ne doit pas dépasser 10 caractères")
      .matches(/^[^@]*$/, "Le nom ne doit pas contenir le caractère @"),
    client: Yup.string()
      .required("Nom du client est obligatoire")
      .max(10, "Le nom ne doit pas dépasser 10 caractères"),
    dateStart: Yup.date().required("Date début est obligatoire"),
    dateEnd: Yup.date()
      .required("Date fin est obligatoire")
      .when("dateStart", (dateStart, schema) => {
        return schema.min(
          dateStart,
          "La date de fin doit être après la date de début"
        );
      }),
    tasks: Yup.array().of(
      Yup.object().shape({
        nameTask: Yup.string().required("Nom tache obligatoire"),
        estimatedDuration: Yup.string().required(
          "Date durée estimation obligatoire"
        ),
      })
    ),
  });
  const addTask = (values, setValues) => {
    setValues({
      ...values,
      tasks: [...values.tasks, { nameTask: "", estimatedDuration: "" }],
    });
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
        setProjectStatus(response.data.status);
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
    <PageContainer
      title="Modifier un projet"
      path="/listProjects"
      btnColor="dark"
      btntxt="Retour"
    >
      <Formik
        initialValues={project || initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setLoading(true);
            const shouldSave = await confirmSaveChanges();
            if (shouldSave.isConfirmed) {
              let projectData = { ...values };
              const response = await projectService.updateOne(id, projectData);
              toast.success(response.data.message);
              Navigate("/ListProjects");
              setLoading(false);
            } else if (shouldSave.isDenied) {
              Navigate("/ListProjects");
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
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
          setValues,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nameProject" className="form-label">
                Nom du projet
              </label>
              <Field type="text" className="form-control" name="nameProject" />
              <ErrorMessage
                name="nameProject"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="client" className="form-label">
                Client
              </label>
              <Field type="text" className="form-control" name="client" />
              <ErrorMessage
                name="client"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateStart" className="form-label">
                Date_Début
              </label>
              <Field type="date" className="form-control" name="dateStart" />
              <ErrorMessage
                name="dateStart"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="dateEnd" className="form-label">
                Date_Fin
              </label>
              <Field type="date" className="form-control" name="dateEnd" />
              <ErrorMessage
                name="dateEnd"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label htmlFor="tasks" className="form-label me-3">
                  Tâches :
                </label>
                {/* Bouton pour ajouter une nouvelle tâche */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addTask(values, setValues)}
                  disabled={
                    projectStatus === "Terminé" || projectStatus === "En cours"
                  }
                >
                  Ajouter un tâche
                </button>
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
                    <ErrorMessage
                      name={`tasks.${index}.nameTask`}
                      component="span"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-4 me-2">
                    <Field
                      type="number"
                      min="1"
                      name={`tasks.${index}.estimatedDuration`}
                      className="form-control"
                      placeholder="Durée estimée en heure"
                    />
                    <ErrorMessage
                      name={`tasks.${index}.estimatedDuration`}
                      component="span"
                      className="text-danger"
                    />
                  </div>
                  <div>
                    {values.tasks.length !== 1 && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => deleteTask(index, values, setValues)}
                        disabled={
                          projectStatus === "Terminé" ||
                          projectStatus === "En cours"
                        }
                      >
                        <i className="ti ti-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              btntxt={
                <>
                  {loading ? (
                    <Loading text="Modification en cours..." />
                  ) : (
                    "Valider"
                  )}
                </>
              }
              btnColor="primary"
            />
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default EditProject;
