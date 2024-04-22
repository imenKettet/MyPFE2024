import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PageContainer from '../../reusedComponents/PageContainer'
import { chefService } from '../../../services/chef';
import { CoockieContext } from '../../../features/contexts';
import { userService } from '../../../services/user';
import Modal from 'react-modal';
Modal.setAppElement("*");

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '50%',
    maxHeight: '80%',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
  },
};

const smallScreenStyles = {
  content: {
    top: '50%',
    left: '50%',
    width: '70%',
    maxHeight: '80%',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
  },
};
const MyTeam = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [responsiveStyles, setResponsiveStyles] = useState(modalStyles);
  const [employeeDetails, setEmployeeDetails] = useState();
  const Context = useContext(CoockieContext)
  const [profile, setProfile] = useState({})

  const fetchEmployees = async () => {
    try {
      if (localStorage.getItem('role') === 'chef') {
        const response = await chefService.getOne(Context.id);
        setEmployees(response.data.employees);
      }
      if (localStorage.getItem('role') === 'employe') {
        const response = await userService.getTeamByEmployee(Context.id);
        setEmployees(response.data.team.employees);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = async (employee) => {
    setEmployeeDetails(employee)
    setIsOpen(true);
  }
  const closeModal = () => {
    setIsOpen(false);
  }
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line 
  }, []);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setResponsiveStyles(smallScreenStyles);
      } else {
        setResponsiveStyles(modalStyles);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const response = await userService.getOne(Context.id);
        setProfile(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des projets:", error);
      }
    };
    fetchChef()
    // eslint-disable-next-line  
  }, [Context.id]);
  return (
    <PageContainer title='Liste des employées'  >
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Prénom</th>
            <th scope="col">Nom</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Email</th>
            {localStorage.getItem('role') !== 'employe' && <th scope="col">Affect task</th>}
            <th>Détail</th>
          </tr>
        </thead>
        <tbody>
          {localStorage.getItem('role') === 'chef' && <tr>
            <th><span className='h6'>Moi</span></th>
            <td>{profile.firstName}</td>
            <td>{profile.lastName}</td>
            <td>{profile.phone}</td>
            <td>{profile.email}</td>
            {localStorage.getItem('role') !== 'employe' && <td>
              <Link
                to={'/affect-tasks/' + profile._id}
                state={profile}
                className='btn btn-light'
              >Affect <i className="ti ti-corner-right-up"></i>
              </Link></td>
            }
            <td>
              <i
                className="cursor-pointer ti ti-alert-circle h5 "
                onClick={() => openModal(profile)}
              ></i>
            </td>

          </tr>}
          {employees.map((user, index) => (
            <tr key={user._id}>
              <th>{index + 1}</th>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              {localStorage.getItem('role') !== 'employe' && <td>
                <Link
                  to={'/affect-tasks/' + user._id}
                  state={user}
                  className='btn btn-light'
                >Affect <i className="ti ti-corner-right-up"></i>
                </Link>
              </td>}
              <td>
                <i
                  className="cursor-pointer ti ti-alert-circle h5 "
                  onClick={() => openModal(user)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={responsiveStyles}
        ariaHideApp={false}
        contentLabel="Détail du projet"
      >

        {employeeDetails && <div className="m-5">
          <div className="d-flex h5 gap-3">
            <div className="d-flex flex-column gap-3">
              <strong>Prénom:</strong>
              <strong>Nom:</strong>
              <strong>Télphone:</strong>
              <strong>E-mail:</strong>
            </div>

            <div className="d-flex flex-column gap-3">
              <span>{employeeDetails.firstName}</span>
              <span>{employeeDetails.lastName}</span>
              <span>{employeeDetails.phone}</span>
              <span>{employeeDetails.email}</span>
            </div>
          </div>
          {employeeDetails.tasks.length > 0 ?
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">N°:</th>
                  <th scope="col">Nom de la Tâche</th>
                  <th scope="col">Durée estimée</th>
                  <th scope="col">Statut</th>
                </tr>
              </thead>
              <tbody>{employeeDetails.tasks.map((task, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{task.nameTask}</td>
                    <td>{task.estimatedDuration}</td>
                    <td>
                      <span className={"badge " + (task.Status === 'En attente' ? 'text-bg-secondary' : task.Status === 'En cours' ? 'text-bg-info' : 'text-bg-success')}>{task.Status}</span></td>
                  </tr>
                )
              })}
              </tbody>
            </table> :

            <h4 className='text-center mt-5'>Aucune tâche n'a été affecté à cet employé.</h4>}
        </div>}

      </Modal>
    </PageContainer>
  )
}

export default MyTeam