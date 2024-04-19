import React, { useContext, useEffect, useState } from 'react'
import PageContainer from '../../reusedComponents/PageContainer'
import { taskService } from '../../../services/task';
import { Link } from 'react-router-dom';
import { CoockieContext } from '../../../features/contexts';

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const Context = useContext(CoockieContext)

    const fetchMyTasks = async () => {
        try {
            const response = await taskService.getMyTasks(Context.id);
            setTasks(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchMyTasks();
    }, []);
    return (
        <PageContainer title='Mes tâches'  >
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Titre</th>
                        <th scope="col">Estimation</th>
                        <th scope="col">Journées travaillées</th>
                        <th scope="col">Statue</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <tr key={task._id}>
                            <th>{index + 1}</th>
                            <td>{task.nameTask}</td>
                            <td>{task.estimatedDuration}</td>
                            {task.worked.length > 0 ?
                                <td className='w-50 pt-2'>
                                    <div className="accordion accordion-flush" id="accordionFlushExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header">
                                                <button className="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse" + index} aria-expanded="false" aria-controls="flush-collapseOne">
                                                    <strong>Liste: {task.worked.length}</strong>
                                                </button>
                                            </h2>
                                            <div id={"flush-collapse" + index} className="accordion-collapse collapse bg-light" data-bs-parent="#accordionFlushExample">

                                                <ol className='m-0 py-2'>
                                                    {task.worked?.map((el, j) => {
                                                        return (
                                                            <li className='fs-4' key={j} >
                                                                <div>
                                                                    {el.startTime} À {el.endTime} | Date: {el.dateWorked}
                                                                </div>
                                                            </li>
                                                        )

                                                    })
                                                    }</ol>


                                            </div>
                                        </div>
                                    </div>
                                </td>
                                : <td> Aucune journée travaillée</td>}
                            <td>
                                <span className={"badge  " + (task.Status === 'En attente' ? 'text-bg-secondary' : task.Status === 'En cours' ? 'text-bg-info' : 'text-bg-dark')}>{task.Status}</span>
                            </td>
                            <td>
                                <Link to={'/myTasks/' + task._id} className="btn btn-light">
                                    Remplissage <i className="ti ti-file-pencil"></i>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </PageContainer>
    )
}

export default MyTasks