import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Formik } from "formik";
import Select from "react-select";
import { projectService } from "../../services/project";
import { teamService } from "../../services/team";

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
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
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
        </div>
      </div>
    </div>
  );
};

export default Affectation;

// return (
//   <div className="container-fluid">
//     <div className="container-fluid">
//       <div className="card">
//         <div className="card-body">
//           <h5 className="card-title fw-semibold mb-4">Headings</h5>
//           <div className="card">
//             <div className="card-body p-4">
//               <h1>h1. Bootstrap heading</h1>
//               <h2>h2. Bootstrap heading</h2>
//               <h3>h3. Bootstrap heading</h3>
//               <h4>h4. Bootstrap heading</h4>
//               <h5>h5. Bootstrap heading</h5>
//               <h6>h6. Bootstrap heading</h6>
//             </div>
//           </div>
//           <h5 className="card-title fw-semibold mb-4">
//             Inline text elements
//           </h5>
//           <div className="card mb-0">
//             <div className="card-body p-4">
//               <p>
//                 You can use the mark tag to <mark>highlight</mark> text.
//               </p>
//               <p>
//                 <del>
//                   This line of text is meant to be treated as deleted text.
//                 </del>
//               </p>
//               <p>
//                 <s>
//                   This line of text is meant to be treated as no longer
//                   accurate.
//                 </s>
//               </p>
//               <p>
//                 <ins>
//                   This line of text is meant to be treated as an addition to
//                   the document.
//                 </ins>
//               </p>
//               <p>
//                 <u>This line of text will render as underlined.</u>
//               </p>
//               <p>
//                 <small>
//                   This line of text is meant to be treated as fine print.
//                 </small>
//               </p>
//               <p>
//                 <strong>This line rendered as bold text.</strong>
//               </p>
//               <p className="mb-0">
//                 <em>This line rendered as italicized text.</em>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );
