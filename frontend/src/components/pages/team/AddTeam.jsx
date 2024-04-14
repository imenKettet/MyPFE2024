import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Select from "react-select";
import { userService } from "../../../services/user";
import { teamService } from "../../../services/team";
import * as Yup from 'yup';
import PageContainer from "../../reusedComponents/PageContainer";

const AddTeam = () => {
  const Navigate = useNavigate();
  const [chefUsers, setChefUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [selectedChef, setSelectedChef] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getall();
      const chefUsers = response.data.filter((user) => user.role === "chef" && !user.team);
      const employeeUsers = response.data.filter(
        (user) => user.role === "employe" && !user.team
      );
      setChefUsers(chefUsers);
      setEmployeeUsers(employeeUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const selectChef = (e) => {
    setSelectedChef(e);
  };
  const selectEmployees = (e) => {
    setSelectedEmployees(e);
    console.log(selectedEmployees);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <PageContainer title='Ajouter une équipe' path='/listTeams' btnColor="dark" btntxt='Retour' >
      <Formik
        initialValues={{
          teamName: "",
        }}
        validationSchema={Yup.object().shape({
          teamName: Yup.string().required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (!selectedChef) {
              toast.error("Chef d'équipe est requis");
              return;
            }
            if (selectedEmployees.length === 0) {
              toast.error("Au moins un membre est requis");
              return;
            }
            values.chef = selectedChef.value;
            values.employees = selectedEmployees.map(emp => emp.value);
            console.log(values);
            const response = await teamService.addOne(values);
            toast.success(response.data.message);
            Navigate("/listTeams");
          } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
              toast.error(error.response.data.message);
            }
          } finally {
            setSubmitting(false);
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
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <h4 className=" text-center fw-bolder ">Nouvelle Equipe</h4>
              <label htmlFor="teamName" className="form-label">
                Nom du l'équipe
              </label>
              <input
                id="teamName"
                type="text"
                className="form-control"
                name="teamName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.teamName}
              />
              <div className="text-danger">
                {errors.teamName && touched.teamName && errors.teamName}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="chefSelect" className="form-label">
                Chef d'equipe
              </label>
              <Select
                id="chefSelect"
                name="chefselect"
                options={chefUsers.map((user) => {
                  return {
                    value: user._id,
                    label: `${user.firstName} ${user.lastName}`,
                  };
                })}
                value={selectedChef}
                onChange={selectChef}
              ></Select>
            </div>
            <div className="mb-3">
              <label htmlFor="employeeSelect" className="form-label">
                Membres
              </label>
              <Select
                id="employeeSelect"
                name="employeeSelect"
                options={employeeUsers.map((user) => {
                  return {
                    value: user._id,
                    label: `${user.firstName} ${user.lastName}` /* Concaténer prénom et nom */,
                  };
                })}
                value={selectedEmployees}
                onChange={selectEmployees}
                isMulti
              ></Select>
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
              Enregistrer
            </button>
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default AddTeam;
