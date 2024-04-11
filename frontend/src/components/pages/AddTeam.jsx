import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Select from "react-select";
import { userService } from "../../services/user";
import { teamService } from "../../services/team";

const AddTeam = () => {
  const Navigate = useNavigate();
  const [chefUsers, setChefUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [selectedChef, setSelectedChef] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getall();
      const chefUsers = response.data.filter((user) => user.role === "chef");
      const employeeUsers = response.data.filter(
        (user) => user.role === "employe"
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
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={{
              teamName: "",
              chef: "",
              employees: [],
            }}
            validate={(values) => {
              const errors = {};
              if (!values.teamName) {
                errors.teamName = "Requis";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              try {
                values.chef = selectedChef.value;
                values.employees = selectedEmployees;
                const response = await teamService.addOne(values);
                console.log();
                toast.success(response.data.message);
                Navigate("/ListTeams");
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
        </div>
      </div>
    </div>
  );
};

export default AddTeam;

//methode 1
// <div className="mb-3">
// <label
//   htmlFor="exampleInputEmail1"
//   className="form-label"
// >
//   Chef d'equipe
// </label>
// <Select
//   className="form-select"
//   name="chef"
//   options={chefUsers.map((user) => ({
//     value: user._id,
//     label: `${user.firstName} ${user.lastName}`,
//   }))}
//   value={values.chef}
//   onChange={handleChange}
//   onBlur={handleBlur}
// />
// </div>
// <div className="mb-3">
// <label
//   htmlFor="exampleInputEmail1"
//   className="form-label"
// >
//   Membres
// </label>
// <Select
//   className="form-select"
//   name="employees"
//   options={employeeUsers.map((user) => ({
//     value: user._id,
//     label: `${user.firstName} ${user.lastName}`,
//   }))}
//   value={values.employees}
//   isMulti
//   onChange={handleChange}
//   onBlur={handleBlur}
// />
// </div>

// methode 2
// <div className="mb-3">
// <label
//   htmlFor="exampleInputEmail1"
//   className="form-label"
// >
//   Chef d'equipe
// </label>

// <select
//   className="form-select"
//   aria-label="Sélectionnez le chef d'équipe"
//   name="chef"
//   onChange={handleChange}
//   onBlur={handleBlur}
//   value={values.chef}
// >
//   <option value="">
//     Sélectionnez le chef de l'équipe
//   </option>
//   {chefUsers.map((user) => (
//     <option key={user._id} value={user._id}>
//       {`${user.firstName} ${user.lastName}`}
//       {/* Concaténer prénom et nom */}
//     </option>
//   ))}
// </select>
// </div>
// <div className="mb-3">
// <label
//   htmlFor="exampleInputEmail1"
//   className="form-label"
// >
//   Membres
// </label>
// <select
//   className="form-select"
//   aria-label="Default select example"
//   name="employee"
//   aria-describedby="emailHelp"
//   onChange={handleChange}
//   onBlur={handleBlur}
// >
//   <option value="">
//     Sélectionnez le chef de l'équipe
//   </option>
//   {employeeUsers.map((user) => (
//     <option key={user._id} value={user._id}>
//       {`${user.firstName} ${user.lastName}`}
//     </option>
//   ))}
// </select>
// </div>
