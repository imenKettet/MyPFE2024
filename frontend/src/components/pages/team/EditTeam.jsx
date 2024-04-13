import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import Select from "react-select";
import Swal from "sweetalert2";
import { teamService } from "../../../services/team";
import { userService } from "../../../services/user";

const EditTeam = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [team, setTeam] = useState();
  const [chefUsers, setChefUsers] = useState([]);
  const [employeeUsers, setEmployeeUsers] = useState([]);
  const [selectedChef, setSelectedChef] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await teamService.getOne(id);
        setSelectedChef(response.data.chef)
        setSelectedEmployees(response.data.employees)
        setTeam(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeam();
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getall();
      const chefUsers = response.data.filter(
        (user) => user.role === "chef"
      );
      const employeeUsers = response.data.filter(
        (user) => user.role === "employe"
      );
      setChefUsers(chefUsers);
      setEmployeeUsers(employeeUsers);
      console.log(employeeUsers);
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

  // Fonction pour afficher la confirmation avant d'enregistrer les modifications
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
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={
              team || {
                teamName: "",
              }
            }
            onSubmit={async (values) => {
              try {
                const shouldSave = await confirmSaveChanges();
                if (shouldSave.isConfirmed) {
                  if (!selectedChef) {
                    toast.error("Chef d'équipe est requis");
                    return;
                  }
                  if (selectedEmployees.length === 0) {
                    toast.error("Au moins un membre est requis");
                    return;
                  }
                  let chefId = selectedChef.value
                  let employeesIds = []
                  selectedEmployees.map(emp => employeesIds.push(emp.value))
                  const team = {
                    teamName: values.teamName,
                    chef: chefId,
                    employees: employeesIds
                  }
                  const response = await teamService.updateOne(id, team);
                  toast.success(response.data.message);
                  Navigate("/listTeams");
                } else if (shouldSave.isDenied) {
                  Navigate("/listTeams");
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
              setFieldValue,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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
                </div>
                <div className="mb-3">
                  <label htmlFor="chefSelect" className="form-label">
                    Chef d'equipe
                  </label>
                  <Select
                    options={chefUsers.map((user) => {
                      return {
                        value: user._id,
                        label: `${user.firstName} ${user.lastName}` /* Concaténer prénom et nom */,
                      };
                    })}
                    value={selectedChef}
                    onChange={selectChef}
                  />
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
                        label: `${user.firstName} ${user.lastName}`,
                      };
                    })}
                    onBlur={handleBlur}
                    value={selectedEmployees}
                    onChange={selectEmployees}
                    isMulti
                  />
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
        </div>
      </div>
    </div>
  );
};

export default EditTeam;
