import React from "react";
import { useState, useEffect } from "react";
import { userService } from "../../../services/user";

const MyAbsence = () => {
  const [absences, setAbsences] = useState([]);
  const fetchAbsences = async () => {
    try {
      const response = await userService.getdetails();
      setAbsences(response.data.absences);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
  };
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    fetchAbsences();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <h5 className="fw-semibold text-center "> Mes absences </h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Num</th>
                <th scope="col">date</th>
                <th scope="col">Type d'absence</th>
                <th scope="col">Durée</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence, index) => (
                <tr key={absence._id}>
                  <td> {index + 1} </td>
                  <td>{new Date(absence.date).toLocaleDateString('fr-FR', options)}</td>
                  <td>{absence.absenceType}</td>
                  <td>{absence.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyAbsence;
