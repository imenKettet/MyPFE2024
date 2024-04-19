import React, { useContext, useEffect, useState } from "react";
import PageContainer from "../reusedComponents/PageContainer";
import { taskService } from "../../services/task";
import { CoockieContext } from "../../features/contexts";

const MyListTimeSheet = () => {
  const [tasks, setTasks] = useState([]);
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

  const formattedDurations = tasks.map(task =>
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
  );

  const totalHoursPerDay = days.map((day, dayIndex) => {
    const totalHoursForDay = tasks.flatMap(task => {
      const dayTasks = filterTasksForCurrentWeek(task);
      const tasksForDay = dayTasks.filter(entry => new Date(entry.dateWorked).getDay() === dayIndex + 1);
      const totalDurationForDay = tasksForDay.reduce((acc, curr) => {
        const startTime = new Date(`1970-01-01T${curr.startTime}`);
        const endTime = new Date(`1970-01-01T${curr.endTime}`);
        const duration = endTime - startTime;
        return acc + duration;
      }, 0);
      return totalDurationForDay / (1000 * 60 * 60); // Convert milliseconds to hours
    });
    return totalHoursForDay.reduce((acc, curr) => acc + curr, 0); // Calculate sum of hours for the day
  });
  const totalOfTotalDurations = formattedDurations.flat().reduce((acc, duration) => acc + parseFloat(duration), 0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskService.getMyTasks(Context.id); // Assuming taskService.getAll() fetches all tasks
        setTasks(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches:", error);
      }
    };
    fetchTasks()
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
              <th className="border text-dark bg-light-warning">Temps éstimé(h)</th>
              <th className="border text-dark bg-light-warning">Durée (heures)</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, taskIndex) => (
              <tr key={taskIndex}>
                <td className="border bg-light">{task.project.nameProject}</td>
                <td className="border bg-light">{task.nameTask}</td>
                {days.map((day, dayIndex) => (
                  <td
                    className={"border" + (formattedDurations[taskIndex][dayIndex].toFixed(2) !== '0.00' && ' bg-light')} key={dayIndex}

                  >
                    {/* Render tasks for each day */}
                    <span >{formattedDurations[taskIndex][dayIndex].toFixed(2)}</span> {/* Format total hours with 2 decimal places */}
                  </td>
                ))}
                {/* Display total duration for the week */}
                <td className={"border bg-light"}>{task.estimatedDuration}  h</td>
                <td className="border bg-light">
                  {/* Calculate and display total hours for the week */}
                  {formattedDurations[taskIndex].reduce((acc, totalHours) => acc + parseFloat(totalHours), 0).toFixed(2)} h
                </td>
              </tr>
            ))}
            {/* Row for total hours per day */}
            <tr>
              <td className="border text-dark bg-light-warning">Total heures/jour</td>
              <td className="border text-dark">N/A</td>
              {totalHoursPerDay.map((totalHours, index) => (
                <td className={"border" + (totalHours.toFixed(2) !== '0.00' && ' bg-light')} key={index}>{totalHours.toFixed(2)} </td>
              ))}
              {/* Placeholder cell for the total weekly hours */}
              <td className={"border bg-light"}>{tasks.reduce((accumulator, currentValue) => accumulator + currentValue.estimatedDuration, 0)} h</td>
              <td className={"border bg-light"}>{totalOfTotalDurations.toFixed(2)} h</td>
            </tr>
          </tbody>
        </table>

      </div>

    </PageContainer>
  );
}

export default MyListTimeSheet;
