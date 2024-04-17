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

  const formattedDurations = projects.map(project =>
    project.tasks.map(task =>
      days.map((day, dayIndex) => {
        const dayTasks = filterTasksForCurrentWeek(task);
        const tasksForDay = dayTasks.filter(entry => new Date(entry.dateWorked).getDay() === dayIndex + 1);
        const totalDuration = tasksForDay.reduce((acc, curr) => {
          const startTime = new Date(`1970-01-01T${curr.startTime}`);
          const endTime = new Date(`1970-01-01T${curr.endTime}`);
          const duration = endTime - startTime;
          return acc + duration;
        }, 0);
        // Convert milliseconds to hours
        const totalHours = totalDuration / (1000 * 60 * 60);
        return totalHours; // Return total hours directly
      })
    )
  );

  const totalHoursPerDay = days.map((day, dayIndex) => {
    const totalHoursForDay = projects.flatMap(project =>
      project.tasks.flatMap(task => {
        const dayTasks = filterTasksForCurrentWeek(task);
        const tasksForDay = dayTasks.filter(entry => new Date(entry.dateWorked).getDay() === dayIndex + 1);
        const totalDurationForDay = tasksForDay.reduce((acc, curr) => {
          const startTime = new Date(`1970-01-01T${curr.startTime}`);
          const endTime = new Date(`1970-01-01T${curr.endTime}`);
          const duration = endTime - startTime;
          return acc + duration;
        }, 0);
        return totalDurationForDay / (1000 * 60 * 60); // Convert milliseconds to hours
      })
    );
    return totalHoursForDay.reduce((acc, curr) => acc + curr, 0); // Calculate sum of hours for the day
  });
  const totalOfTotalDurations = formattedDurations.flat().flat().reduce((acc, duration) => acc + parseFloat(duration), 0);

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
      <div style={{ overflowX: 'scroll' }}>
        <table className="table mt-3">
          <thead>
            <tr className="border bg-light">
              <th className="border text-dark bg-light-warning">Projet</th>
              <th className="border text-dark bg-light-warning">Tâche</th>
              {days.map((day, index) => (
                <th className="border text-dark bg-light-warning" key={index}>{day}</th>
              ))}
              <th className="border text-dark bg-light-warning">Durée (heures)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <React.Fragment key={index}>
                {project.tasks.map((task, taskIndex) => (
                  <tr key={taskIndex}>
                    {/* Display project name only once for each project */}
                    {taskIndex === 0 && (
                      <td rowSpan={project.tasks.length} className="border text-dark bg-light-warning">{project.nameProject}</td>
                    )}
                    <td className="border bg-light">{task.nameTask}</td>
                    {days.map((day, dayIndex) => (
                      <td className="border" key={dayIndex}>
                        {/* Render tasks for each day */}
                        {formattedDurations[index][taskIndex][dayIndex].toFixed(2)} {/* Format total hours with 2 decimal places */}
                      </td>
                    ))}
                    {/* Display total duration for the week */}
                    <td className="border">
                      {/* Calculate and display total hours for the week */}
                      {formattedDurations[index][taskIndex].reduce((acc, totalHours) => acc + parseFloat(totalHours), 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {/* Row for total hours per day */}
            <tr>
              <td className="border text-dark bg-light-warning">Total heures par jour</td>
              <td>N/A</td>
              {totalHoursPerDay.map((totalHours, index) => (
                <td className="border" key={index}>{totalHours.toFixed(2)}</td>
              ))}
              {/* Placeholder cell for the total weekly hours */}
              <td className="border">{totalOfTotalDurations.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>;

    </PageContainer>
  );
}

export default ListTimeSheet;
