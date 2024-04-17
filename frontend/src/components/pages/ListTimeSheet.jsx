import React, { useContext, useEffect, useState } from "react";
import PageContainer from "../reusedComponents/PageContainer";
import { taskService } from "../../services/task";
import { CoockieContext } from "../../features/contexts";
import { chefService } from "../../services/chef";

const ListTimeSheet = () => {
  const [projects, setProjects] = useState([]);
  const Context = useContext(CoockieContext); // Ensure the context name is correctly spelled
  const currentStartDate = new Date();
  const currentDayOfWeek = currentStartDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysToAdd = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek; // Calculate days to add to get to Monday
  const dateStart = new Date(currentStartDate);
  dateStart.setDate(dateStart.getDate() + daysToAdd); // Set start date to Monday of the current week
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + 6); // Set end date to Sunday of the current week

  // Initialize state to hold the current week's start and end dates
  const [week, setWeek] = useState({
    start: dateStart,
    end: dateEnd
  });
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const handlePreviousWeek = () => {
    const newStartDate = new Date(week.start);
    newStartDate.setDate(newStartDate.getDate() - 7);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    setWeek({ start: newStartDate, end: newEndDate });
  };

  // Function to handle next week button click
  const handleNextWeek = () => {
    const newStartDate = new Date(week.start);
    newStartDate.setDate(newStartDate.getDate() + 7);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 6);
    setWeek({ start: newStartDate, end: newEndDate });
  };

  // Function to filter tasks for the current week
  const filterTasksForCurrentWeek = (task) => {
    return task.worked.filter(entry => {
      const entryDate = new Date(entry.dateWorked);
      return entryDate >= week.start && entryDate <= week.end;
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await chefService.getOne(Context.id);
        setProjects(response.data.projects);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    };
    fetchProjects()
  }, [Context.id]);
  return (
    <PageContainer title='Feuille de temps'>
      <div className="d-flex gap-2">
        <button className="btn btn-light" onClick={handlePreviousWeek}><i className="ti ti-chevron-left"></i></button>
        <button className="btn btn-light">{week.start.toDateString()} - {week.end.toDateString()}</button>
        <button className="btn btn-light" onClick={handleNextWeek}><i className="ti ti-chevron-right"></i></button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr className="border bg-light">
            <th>Projet:</th>
            <th>Tâche:</th>
            {days.map((day, index) => (
              <th className="border" key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <React.Fragment key={index}>
              {project.tasks.map((task, taskIndex) => (
                <tr key={taskIndex}>
                  {/* Display project name only once for each project */}
                  {taskIndex === 0 && (
                    <td rowSpan={project.tasks.length} className="border">{project.nameProject}</td>
                  )}
                  <td>{task.nameTask}</td>
                  {days.map((day, dayIndex) => {
                    const dayTasks = filterTasksForCurrentWeek(task);
                    const tasksForDay = dayTasks.filter(entry => new Date(entry.dateWorked).getDay() === dayIndex + 1);
                    return (
                      <td className="border" key={dayIndex}>
                        {tasksForDay.map((task, idx) => (
                          <div key={idx}>
                            {`${task.startTime} - ${task.endTime}`}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
}

export default ListTimeSheet;
