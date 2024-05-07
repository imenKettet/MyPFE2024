import { useContext, useEffect, useState } from "react";
import PageContainer from "../../reusedComponents/PageContainer";
import Select from "react-select";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { CoockieContext } from "../../../features/contexts";
import { chefService } from "../../../services/chef";
import { userService } from "../../../services/user";
import { projectService } from "../../../services/project";
import Loading from "../../reusedComponents/Loading";
import Button from "../../reusedComponents/Button";

const AffectTasks = () => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [user, setUser] = useState({});
  const Context = useContext(CoockieContext);
  const { id } = useParams();
  const selectProject = async (e) => {
    try {
      const response = await projectService.getOne(e.value);
      setProject(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
    setSelectedProject(e);
    selectedProject?.length === 0 && setProject(null);
  };
  const selectTasks = (e) => {
    setSelectedTasks(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProject === null) {
        toast.error("Veuillez choisir un projet");
        return;
      } else if (!selectedTasks || selectedTasks.length === 0) {
        toast.error("Vous n'avez pas selectionné de taches");
        return;
      }
      setLoading(true);
      const data = {
        tasksId: selectedTasks.map((task) => task.value),
        project: selectedProject?.value,
      };
      const response = await chefService.affectTasks(user._id, data);
      toast.success(response.data.message);
      setLoading(false);
      Navigate("/my-team");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    const taskList = async () => {
      try {
        const response = await chefService.getOne(Context.id);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    };
    taskList();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.getOne(id);
      setUser(response.data);
    };
    fetchUser();
  }, [id]);

  return (
    <PageContainer
      title={`Affecter des tâches à - ${user.firstName} ${user.lastName}`}
      path="/my-team"
      btnColor="dark"
      btntxt="Retour"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="projects" className="form-label">
            Choisit un projet:
          </label>
          <Select
            id="projects"
            name="projects"
            options={projects?.map((project) => {
              return {
                value: project._id,
                label: project.nameProject /* Concaténer prénom et nom */,
              };
            })}
            placeholder={"Choisir un projet"}
            value={selectedProject}
            onChange={selectProject}
          ></Select>
        </div>
        {/* {project !== null &&  */}
        <div className="mb-3">
          <label htmlFor="tasks" className="form-label">
            Choisit des tâches:
          </label>
          <Select
            id="tasks"
            name="tasks"
            options={
              project?.tasks
                ? project.tasks
                    .filter((task) => !task.user)
                    .map((task) => ({
                      value: task._id,
                      label: task.nameTask,
                    }))
                : []
            }
            value={selectedTasks}
            onChange={selectTasks}
            placeholder={"Choisir une ou plusieurs taches"}
            noOptionsMessage={() => "Pas de tâches disponibles pour affecter"}
            isMulti
          ></Select>
        </div>
        {/* } */}
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
      </form>
    </PageContainer>
  );
};

export default AffectTasks;
