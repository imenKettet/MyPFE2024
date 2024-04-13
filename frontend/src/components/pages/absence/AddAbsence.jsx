import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { absenceService } from "../../../services/absence";
import { userService } from "../../../services/user";

const AddAbsence = () => {
  const Navigate = useNavigate();
  const [employeUsers, setEmployeUsers] = useState([]);
  const [selectedEmploye, setSelectedEmploye] = useState("");

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
  }, []);

  return (
    <div className="container-fluid">
      <div className="card ">
        <div className="card-body">
          <Formik
            initialValues={{
              date: "",
              employe: "",
              absenceType: "Toute la journée",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.date) {
                errors.date = "Requis";
              }
              if (!values.absenceType) {
                errors.absenceType = "Requis";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              try {
                values.employe = selectedEmploye.value;
                const response = await absenceService.addOne(values);
                toast.success(response.data.message);
                Navigate("/ListAbsences");
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
                  <h4 className=" text-center fw-bolder">
                    Nouvelle fiche d'absence
                  </h4>
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    id="date"
                    type="Date"
                    className="form-control"
                    name="date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.date}
                  />
                  <div className="text-danger">
                    {errors.date && touched.date && errors.date}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="empolyeSelect" className="form-label">
                    Employe
                  </label>
                  <Select
                    id="empolyeSelect"
                    name="empolye"
                    options={employeUsers.map((user) => {
                      return {
                        value: user._id,
                        label: `${user.firstName} ${user.lastName}`,
                      };
                    })}
                    value={selectedEmploye}
                    onChange={selectEmploye}
                  ></Select>

                  <div className="text-danger">
                    {errors.employe && touched.employe && errors.employe}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="absenceType" className="form-label">
                    Type d'absence
                  </label>
                  <select
                    id="absenceType"
                    className="form-select"
                    aria-label="Default select example"
                    name="absenceType"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="journée"> Toute la journée</option>
                    <option value="demiJournée"> Demi-Journée </option>
                    <option value="autorisation"> Autorisation </option>
                  </select>
                  <div className="text-danger">
                    {errors.absenceType &&
                      touched.absenceType &&
                      errors.absenceType}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary py-8 fs-4 mb-4 rounded-2 "
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

export default AddAbsence;
