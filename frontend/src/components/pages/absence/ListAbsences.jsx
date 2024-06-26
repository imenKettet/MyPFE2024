import React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { absenceService } from "../../../services/absence";
import PageContainer from "../../reusedComponents/PageContainer";
import { Link } from "react-router-dom";

const ListAbsences = () => {
  const [Absences, setAbsences] = useState([]);
  const fetchAbsences = async () => {
    try {
      const response = await absenceService.getall();
      setAbsences(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des projets:", error);
    }
  };
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    fetchAbsences();
    // eslint-disable-next-line
  }, []);

  // Fonction pour afficher la boîte de dialogue de confirmation de suppression
  const confirmDelete = (absenceId) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Annuler",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme la suppression, appeler la fonction pour supprimer
        deleteAbsence(absenceId);
      }
    });
  };
  // Fonction pour supprimer
  const deleteAbsence = async (id) => {
    try {
      await absenceService.deleteOne(id);
      // Rafraîchir la liste des absences après la suppression
      fetchAbsences();
      // Afficher une notification de suppression réussie
      Swal.fire({
        title: "Supprimé !",
        text: "Votre projet a été supprimé.",
        icon: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      // Afficher une notification en cas d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Une erreur s'est produite lors de la suppression du projet.",
        icon: "error",
      });
    }
  };
  return (
    <PageContainer
      title='Liste des absences'
      path="/AddAbsence"
      btnColor="primary"
      btntxt='Ajouter'
    >
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Prénom</th>
            <th scope="col">Type d'absence</th>
            <th scope="col">Durée </th>
            <th scope="col">Date </th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Absences.map((absence) => (
            <tr key={absence._id}>
              <td>{absence.employe.firstName}</td>
              <td>{absence.employe.lastName}</td>
              <td>{absence.absenceType}</td>
              <td>{absence.duration}</td>
              <td>{new Date(absence.date).toLocaleDateString('fr-FR', options)}</td>
              <td>
                <div>
                  <Link to={'/editAbsence/' + absence._id} ><i className="cursor-pointer ti ti-pencil h3 text-success me-2"></i></Link>
                  <i
                    className="cursor-pointer ti ti-trash h3 text-danger me-2"
                    onClick={() => confirmDelete(absence._id)}
                  ></i>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageContainer>
  );
};

export default ListAbsences;
