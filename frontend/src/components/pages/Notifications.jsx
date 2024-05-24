import React, { useContext, useEffect, useState } from 'react'
import PageContainer from '../reusedComponents/PageContainer'
import { CoockieContext } from '../../features/contexts';
import { notificationService } from '../../services/notification';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Africa/Tunis',
    hour12: false
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const Context = useContext(CoockieContext);
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    const totalPages = Math.ceil(notifications.length / notificationsPerPage);

    const indexOfLastNotification = currentPage * notificationsPerPage; // 10 , 20 , 30 
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage; // 10 -10 = 0
    const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

    // Function to handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const readAllNotifications = async () => {
        const response = await notificationService.readAllNotifications()
        if (!response.error) {
            toast.success(response.data.message)
            fetchNotifications()
        } else {
            console.log('Erreur : ', response.error)
        }
    }

    const readOneNotification = async (id) => {
        const response = await notificationService.readOneNotification(id)
        if (!response.error) {
            fetchNotifications()
            navigate('/listAbsences')
        } else {
            console.log('Erreur : ', response.error)
        }
    }
    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getAll();
            setNotifications(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchNotifications()
    }, [Context.id]);
    return (
        <PageContainer click={readAllNotifications} title='Mes notifications' btnColor={'link'} btntxt={'Lire tout'} >
            <div className="list-group">
                {currentNotifications.length > 0 ? (
                    currentNotifications.map((notification, index) => {
                        return (
                            <div key={index} onClick={() => readOneNotification(notification._id)} className={"list-group-item list-group-item-action cursor-pointer" + (!notification?.viewed && ' bg-light-warning')} aria-current="true">
                                <div className="d-flex w-100 justify-content-between">
                                    {notification?.absence?.date
                                        ?
                                        <h5 className="mb-1">{notification?.title}  le {notification?.absence?.date}</h5>
                                        :
                                        <h5 className="mb-1">{notification?.title}</h5>
                                    }
                                    <small>{new Date(notification?.createdAt).toLocaleString('fr-Fr', options)}</small>
                                </div>
                                {notification?.absence?.absenceType && <p className="mb-1">Type d'absence: {notification?.absence?.absenceType.charAt(0).toUpperCase() + notification?.absence?.absenceType?.slice(1)}</p>}
                                <div>
                                    {notification?.chef?.firstName && <small>Créé par: {notification?.chef?.firstName}</small>}
                                </div>
                                {!notification?.viewed && <span className='rounded-pill notification top-50 bg-danger'></span>}
                            </div>
                        );
                    })
                ) : (
                    <div className="list-group-item list-group-item-action cursor-pointer" aria-current="true">
                        <div className="d-flex w-100 justify-content-center">
                            <span className="mb-1 fs-5 text-muted">Pas de nouvelles notifications reçus</span>
                        </div>
                    </div>
                )}
            </div>
            <nav aria-label="Page navigation" className='mt-3'>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(index + 1)} className="page-link">
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </PageContainer>
    )
}

export default Notifications