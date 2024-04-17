import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { projectService } from "../../../services/project";
import PageContainer from "../../reusedComponents/PageContainer";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";

const AddProject = () => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false)

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
    dateEnd: Yup.date()
      .required('Date fin obligatoire')
      .when('dateStart', (dateStart, schema) => {
        return schema.min(dateStart, 'La date de fin doit être après la date de début');
      }),
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
    <PageContainer title='Ajouter un projet' path='/listProjects' btnColor="dark" btntxt='Retour' >

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setLoading(true)
            let project = { ...values };
            const response = await projectService.addOne(project);
            toast.success(response.data.message);
            Navigate("/ListProjects");
            setLoading(false)
          } catch (error) {
            setLoading(false)
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
              <label htmlFor="nameProject" className="form-label">
                Nom du projet
              </label>
              <Field
                type="text"
                className="form-control"
                name="nameProject"
              />
              <ErrorMessage name="nameProject" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="client" className="form-label">
                Client
              </label>
              <Field
                type="text"
                className="form-control"
                name="client"
              />
              <ErrorMessage name="client" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="dateStart" className="form-label">
                Date_Début
              </label>
              <Field
                type="date"
                className="form-control"
                name="dateStart"
              />
              <ErrorMessage name="dateStart" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="dateEnd" className="form-label">
                Date_Fin
              </label>
              <Field
                type="date"
                className="form-control"
                name="dateEnd"
              />
              <ErrorMessage name="dateEnd" component="div" className="text-danger" />
            </div>
            <hr />
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label htmlFor="tasks" className="form-label">
                  Tâches:
                </label>
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
                      placeholder="Durée estimée en heure"
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
            <Button type='submit' btntxt={<>{loading ? <Loading text='Enregistrement en cours...' /> : 'Enregistrer'}</>} btnColor='primary' />
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default AddProject;