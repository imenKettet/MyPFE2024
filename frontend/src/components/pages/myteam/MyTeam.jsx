import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import PageContainer from '../../reusedComponents/PageContainer'
import { chefService } from '../../../services/chef';
import { CoockieContext } from '../../../features/contexts';
import { userService } from '../../../services/user';

const MyTeam = () => {
  const [employees, setEmployees] = useState([]);
  const Context = useContext(CoockieContext)
  const [profile, setProfile] = useState({})

  const fetchEmployees = async () => {
    try {
      const response = await chefService.getOne(Context.id);
      setEmployees(response.data.employees);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchEmployees();
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
  }, [Context.id]);
  return (
    <PageContainer title='Liste des employées'  >
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nom</th>
            <th scope="col">Prénom</th>
            <th scope="col">Téléphone</th>
            <th scope="col">Email</th>
            {localStorage.getItem('role') !== 'employe' && <th scope="col">Affect task</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th><span className='h6'>Moi</span></th>
            <td>{profile.lastName}</td>
            <td>{profile.firstName}</td>
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

          </tr>
          {employees.map((user, index) => (
            <tr key={user._id}>
              <th>{index + 1}</th>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  )
}

export default MyTeam