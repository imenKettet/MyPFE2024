import React, { useContext, useEffect, useState } from "react";
import PageContainer from "../reusedComponents/PageContainer";
import { taskService } from "../../services/task";
import { CoockieContext } from "../../features/contexts";
import { chefService } from "../../services/chef";
import { userService } from "../../services/user";
import { projectService } from "../../services/project";
import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import Button from "../reusedComponents/Button";
import Loading from "../reusedComponents/Loading";

const ListTimeSheet = () => {
  const [projects, setProjects] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const Context = useContext(CoockieContext);
  const currentStartDate = new Date();
  const currentDayOfWeek = currentStartDate.getDay();
  const daysToAdd = currentDayOfWeek === 1 ? 0 : currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const dateStart = new Date(currentStartDate);
  dateStart.setDate(dateStart.getDate() + daysToAdd);
  const dateEnd = new Date(dateStart);
  dateEnd.setDate(dateEnd.getDate() + 6);

  const [week, setWeek] = useState({
    start: dateStart,
    end: dateEnd
  });

  const [loading, setLoading] = useState(false)
  const validationSchema = Yup.object().shape({
    startTime: Yup.string().required('L\'heure de début est requise'),
    endTime: Yup.string()
      .required('L\'heure de fin est requise')
      .when('startTime', (startTime, schema) => (
        startTime &&
        schema.test({
          test: function (endTime) {
            if (!endTime) return true;
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            return end > start;
          },
          message: 'L\'heure de fin doit être supérieure à l\'heure de début'
        })
      )),
    Status: Yup.string().required('Le statut est requis')
  });

  const initialValues = {
    startTime: '',
    endTime: '',
    dateWorked: '',
    Status: 'En cours'
  };
  const getFormattedDate = (day, weekStartDate) => {
    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const selectedDayIndex = daysOfWeek.indexOf(day);
    const currentDate = new Date(weekStartDate);
    const currentDayOfWeek = currentDate.getDay() - 1;
    const daysToAdd = selectedDayIndex - currentDayOfWeek;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  };

  const handleDurationClick = (userId, projectId, taskId, day) => {
    setSelectedTaskId(taskId);
    const selectedDate = getFormattedDate(day, week.start);
    setSelectedDate(selectedDate);
  };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (selectedTaskId !== '') {
        const response = await taskService.fillTask(selectedTaskId, { ...values, dateWorked: selectedDate })
        toast.success(response.data.message);
      }
      fetchProjects()
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche',];

  const handlePreviousWeek = () => {
    const newStartDate = new Date(week.start);
    newStartDate.setDate(newStartDate.getDate() - 7);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setWeek({ start: newStartDate, end: newEndDate });
  };

  // Function to handle next week button click
  const handleNextWeek = () => {
    const newStartDate = new Date(week.start);
    newStartDate.setDate(newStartDate.getDate() + 7);
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
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
        const dayOfWeek = (dayIndex + 1) % 7; // Adjust indexing for Sunday
        const dayTasks = filterTasksForCurrentWeek(task);
        const tasksForDay = dayTasks.filter(entry => {
          const entryDate = new Date(entry.dateWorked);
          return entryDate.getDay() === dayOfWeek;
        });
        const totalDuration = tasksForDay.reduce((acc, curr) => {
          const startTime = new Date(`1970-01-01T${curr.startTime}`);
          const endTime = new Date(`1970-01-01T${curr.endTime}`);
          const duration = endTime - startTime;
          return acc + duration;
        }, 0);
        const totalHours = totalDuration / (1000 * 60 * 60);
        return totalHours;
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
  const fetchProjects = async () => {
    try {
      const role = localStorage.getItem('role')
      if (role === 'chef') {
        const response = await chefService.getOne(Context.id);
        setProjects(response.data.projects);

      }
      if (role === 'employe') {
        const response = await userService.getOne(Context.id);
        setProjects(response.data.team.projects);
      }
      if (role === 'admin') {
        const response = await projectService.getall();
        setProjects(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
  };
  useEffect(() => {

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
            {projects.map((project, projectIndex) => (
              <React.Fragment key={projectIndex}>
                {project.tasks.map((task, taskIndex) => (
                  <tr key={`${projectIndex}-${taskIndex}`}>
                    {/* Display project name only once for each project */}
                    {taskIndex === 0 && (
                      <td rowSpan={project.tasks.length} className="border text-dark bg-light-warning">
                        {project.nameProject}
                      </td>
                    )}
                    <td className="border bg-light">{task.nameTask}</td>
                    {days.map((day, dayIndex) => {
                      const totalHoursForDay = formattedDurations[projectIndex][taskIndex][dayIndex];
                      return (
                        <td
                          key={`${projectIndex}-${taskIndex}-${dayIndex}`}
                          className={"border" + (totalHoursForDay.toFixed(2) !== '0.00' && ' bg-light')}
                          onClick={() => handleDurationClick(task.user, project._id, task._id, day)}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          {/* Render tasks for each day */}
                          {totalHoursForDay.toFixed(2)} {/* Format total hours with 2 decimal places */}
                        </td>
                      );
                    })}
                    {/* Display total duration for the week */}
                    <td className="border bg-light">
                      {/* Calculate and display total hours for the week */}
                      {formattedDurations[projectIndex][taskIndex].reduce((acc, totalHours) => acc + parseFloat(totalHours), 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {/* Row for total hours per day */}
            <tr>
              <td className="border text-dark bg-light-warning">Total heures/jour</td>
              <td>N/A</td>
              {totalHoursPerDay.map((totalHours, index) => (
                <td className={"border" + (totalHours.toFixed(2) !== '0.00' && ' bg-light')} key={index}>{totalHours.toFixed(2)}</td>
              ))}
              {/* Placeholder cell for the total weekly hours */}
              <td className={"border bg-light"}>{totalOfTotalDurations.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        {/* Bootstrap Modal */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="userIdModalLabel">{selectedDate}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <PageContainer title={"Remplir la tâche"} >
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {(values) => (
                      <Form className='gap-3 d-flex flex-column'>
                        <div>
                          <label htmlFor="startTime">Heure de début</label>
                          <Field className="form-control" type="time" name="startTime" />
                          <ErrorMessage name="startTime" className='text-danger' component="div" />
                        </div>
                        <div>
                          <label htmlFor="endTime">Heure de fin</label>
                          <Field className="form-control" type="time" name="endTime" />
                          <ErrorMessage name="endTime" className='text-danger' component="div" />
                        </div>
                        <div>
                          <label htmlFor="Status">Statut</label>
                          <Field as="select" name="Status" className="form-control">
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                          </Field>
                          <ErrorMessage name="Status" className='text-danger' component="div" />
                        </div>
                        <Button type='submit' btntxt={<>{loading ? <Loading text='Enregistrement en cours...' /> : 'Enregistrer'}</>} btnColor='primary' />
                      </Form>
                    )}
                  </Formik>

                </PageContainer>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </PageContainer>
  );
}

export default ListTimeSheet;
