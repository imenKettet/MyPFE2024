import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Formik } from "formik";
import Select from "react-select";
import { projectService } from "../../../services/project";
import { teamService } from "../../../services/team";
import PageContainer from "../../reusedComponents/PageContainer";

const Affectation = () => {
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);

  const fetchProject = async () => {
    try {
      const response = await projectService.getall();
      setProjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchteams = async () => {
    try {
      const response = await teamService.getall();
      setTeams(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const selectProject = (e) => {
    setSelectedProject(e);
  };
  const selectTeams = (e) => {
    setSelectedTeams(e);
  };
  useEffect(() => {
    fetchProject();
  }, []);

  useEffect(() => {
    fetchteams();
  }, []);

  return (
    <PageContainer title='Affecter un projet à une équipe' path='/listProjects' btnColor="dark" btntxt='Retour' >

      <Formik
        initialValues={{
          project: "",
          teams: [],
        }}
        onSubmit={async (values) => {
          try {
            const response = await projectService.affectProjectToTeam({
              project: selectedProject.value,
              teams: selectedTeams,
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
              <h4 className=" text-center">Affectation </h4>
              <label htmlFor="projectSelect" className="form-label">
                choix de projet
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
              <label htmlFor="teamSelect" className="form-label">
                choix de l'equipe
              </label>
              <Select
                id="teamselect"
                options={teams.map((team) => {
                  return {
                    value: team._id,
                    label: team.teamName,
                  };
                })}
                value={selectedTeams}
                onChange={selectTeams}
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

export default Affectation;