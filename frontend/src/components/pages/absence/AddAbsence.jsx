import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { absenceService } from "../../../services/absence";
import { userService } from "../../../services/user";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";
import PageContainer from "../../reusedComponents/PageContainer";

const validationSchema = Yup.object().shape({
  date: Yup.string().required("Requis"),
  absenceType: Yup.string().required("Requis")
});

const AddAbsence = () => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [employeUsers, setEmployeUsers] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await userService.getall();
      setEmployeUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const selectEmploye = (e) => {
    setSelectedEmploye(e);
  };
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <PageContainer title={"Ajouter une absence"} >
      <Formik
        initialValues={{
          date: "",
          selectedEmployee: "",
          absenceType: "Toute la journée",
          duration: 0,
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setLoading(true);
            if (selectedEmploye === null) {
              toast.error("Veuillez sélectionner un employé!");
              setLoading(false);
              return;
            }
            values.absenceType === "Toute la journée" &&
              (values.duration = 8);
            values.absenceType === "Demi journée" &&
              (values.duration = 4);
            values.employe = selectedEmploye.value;
            const response = await absenceService.addOne(values);
            toast.success(response.data.message);
            Navigate("/ListAbsences");
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.log(error);
            if (error.response.status === 400) {
              toast.error(error.response.data.message);
            }
          }
          setSubmitting(false);
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
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <Field
                id="date"
                type="date"
                className="form-control"
                name="date"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="empolyeSelect" className="form-label">
                Employe
              </label>
              <Select
                id="empolyeSelect"
                name="selectedEmployee"
                options={employeUsers.map((user) => ({
                  value: user._id,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
                value={selectedEmploye}
                onChange={selectEmploye}
              />
              <ErrorMessage
                name="selectedEmployee"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="absenceType" className="form-label">
                Type d'absence
              </label>
              <Field
                as="select"
                id="absenceType"
                className="form-select"
                name="absenceType"
              >
                <option value="Toute la journée"> Toute la journée</option>
                <option value="Demi journée"> Demi-Journée </option>
                <option value="Autorisation"> Autorisation </option>
              </Field>
              <ErrorMessage
                name="absenceType"
                component="div"
                className="text-danger"
              />
              {values.absenceType === "Autorisation" && (
                <>
                  <div className="mb-3">
                    <label htmlFor="duration" className="form-label">
                      Durée
                    </label>
                    <Field
                      id="duration"
                      type="number"
                      className="form-control"
                      name="duration"
                      min={1}
                    />
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </>
              )}
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

export default AddAbsence;
