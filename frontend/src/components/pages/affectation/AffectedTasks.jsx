import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Formik } from "formik";
import Select from "react-select";
import { teamService } from "../../../services/team";
import { projectService } from "../../../services/project";

const AffectedTasks = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedEmploye, setselectedEmploye] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await teamService.getall();
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchemployees = async () => {
    try {
      const response = await teamService.getall();
      setEmployees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectProject = (e) => {
    setSelectedProject(e);
  };
  const selectEmploye = (e) => {
    setselectedEmploye(e);
  };
  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchemployees();
  }, []);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={{
              project: "",
              employees: "",
            }}
            onSubmit={async (values) => {
              try {
                const response = await projectService.affectProjectToTeam({
                  project: selectedProject.value,
                  employees: selectedEmploye,
                });
                toast.success(response.data.message);
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
                  <h4 className=" text-center">Affecter les tâches</h4>
                  <label htmlFor="employe" className="form-label">
                    Choix de l'employé
                  </label>
                  <Select
                    id="employe"
                    options={employees.map((em) => {
                      return {
                        value: em._id,
                        label: em.firstName,
                      };
                    })}
                    value={selectedEmploye}
                    onChange={selectEmploye}
                  ></Select>
                </div>
                <div className="mb-3">
                  <label htmlFor="projectSelect" className="form-label">
                    Choix de projet
                  </label>
                  <Select
                    id="projectSelect"
                    options={projects.map((project) => {
                      return {
                        value: project._id,
                        label: project.nameProject,
                      };
                    })}
                    value={selectedProject}
                    onChange={selectProject}
                  ></Select>
                </div>
                <div className="mb-3">
                  <label htmlFor="projectSelect" className="form-label">
                    Les tâches
                  </label>
                  <Select
                    id="projectSelect"
                    options={projects.map((project) => {
                      return {
                        value: project._id,
                        label: project.nameProject,
                      };
                    })}
                    value={selectedProject}
                    onChange={selectProject}
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

export default AffectedTasks;
