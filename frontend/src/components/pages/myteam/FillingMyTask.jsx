import React, { useState } from "react";
import PageContainer from "../../reusedComponents/PageContainer";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { taskService } from "../../../services/task";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";
const FillingMyTask = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required("L'heure de début est requise"),
    // .test(
    //   "is-between-8-and-18",
    //   "L'heure de début doit être entre 08:00 et 18:00",
    //   function (value) {
    //     const start = new Date(`2000-01-01T${value}`);
    //     const earliest = new Date(`2000-01-01T08:00`);
    //     const latest = new Date(`2000-01-01T18:00`);
    //     return start >= earliest && start <= latest;
    //   }
    // ),
    endTime: Yup.string()
      .required("L'heure de fin est requise")
      .test(
        "is-greater",
        "L'heure de fin doit être supérieure à l'heure de début",
        function (value) {
          return value > this.parent.startTime;
        }
      ),
    // .test(
    //   "is-between-8-and-18",
    //   "L'heure de fin doit être entre 08:00 et 18:00",
    //   function (value) {
    //     const end = new Date(`2000-01-01T${value}`);
    //     const earliest = new Date(`2000-01-01T08:00`);
    //     const latest = new Date(`2000-01-01T18:00`);
    //     return end >= earliest && end <= latest;
    //   }
    // ),
    dateWorked: Yup.string().required("La date du travail est requise"),
    Status: Yup.string().required("Le statut est requis"),
  });

  const initialValues = {
    startTime: "",
    endTime: "",
    dateWorked: new Date().toISOString().split("T")[0],
    Status: "En cours",
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await taskService.fillTask(id, values);
      toast.success(response.data.message);
      Navigate("/myTasks");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <PageContainer title={"Remplir la tâche"}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(values) => (
          <Form className="gap-3 d-flex flex-column">
            <div>
              <label htmlFor="dateWorked">Date du travail</label>
              <Field
                className="form-control"
                type="date"
                name="dateWorked"
                readOnly
              />
              <ErrorMessage
                name="dateWorked"
                className="text-danger"
                component="div"
              />
            </div>
            <div>
              <label htmlFor="startTime">Heure de début</label>
              <Field className="form-control" type="time" name="startTime" />
              <ErrorMessage
                name="startTime"
                className="text-danger"
                component="div"
              />
            </div>
            <div>
              <label htmlFor="endTime">Heure de fin</label>
              <Field className="form-control" type="time" name="endTime" />
              <ErrorMessage
                name="endTime"
                className="text-danger"
                component="div"
              />
            </div>
            <div>
              <label htmlFor="Status">Statut</label>
              <Field as="select" name="Status" className="form-control">
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </Field>
              <ErrorMessage
                name="Status"
                className="text-danger"
                component="div"
              />
            </div>
            <Button
              type="submit"
              btntxt={
                <>
                  {loading ? (
                    <Loading text="Enregistrement en cours..." />
                  ) : (
                    "Enregistrer"
                  )}
                </>
              }
              btnColor="primary"
            />
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default FillingMyTask;
