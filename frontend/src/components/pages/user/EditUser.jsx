import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { userService } from "../../../services/user";

const EditUser = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getOne(id);
        setUser(response.data); // Mise à jour de userdata avec les données de l'utilisateur récupérées depuis l'API
      } catch (error) {
        console.error("Error fetching userdata data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const confirmSaveChanges = () => {
    return Swal.fire({
      title: "Voulez-vous enregistrer les modifications?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: `Non`,
    });
  };
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-body">
          <Formik
            initialValues={
              user || {
                firstName: "",
                lastName: "",
                phone: "",
                adress: "",
                email: "",
                role: "",
              }
            }
            validationSchema={Yup.object().shape({
              firstName: Yup.string().required('Required'),
              lastName: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email address').required('Required'),
              phone: Yup.string().required('Required'),
              adress: Yup.string().required('Required'),
              role: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const shouldSave = await confirmSaveChanges();
                if (shouldSave.isConfirmed) {
                  const response = await userService.updateOne(id, values);
                  toast.success(response.data.message);
                  Navigate("/list-users");
                } else if (shouldSave.isDenied) {
                  Navigate("/list-users");
                }
              } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                  toast.error(error.response.data.message);
                }
              } finally {
                setSubmitting(false);
              }
            }}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">Nom</label>
                  <Field type="text" name="firstName" className="form-control" />
                  <ErrorMessage name="firstName" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">Prénom</label>
                  <Field type="text" name="lastName" className="form-control" />
                  <ErrorMessage name="lastName" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Téléphone</label>
                  <Field type="text" name="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="adress" className="form-label">Adresse</label>
                  <Field type="text" name="adress" className="form-control" />
                  <ErrorMessage name="adress" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <Field as="select" name="role" className="form-select">
                    <option value="employe">Employe</option>
                    <option value="chef">Chef d'equipe</option>
                  </Field>
                  <ErrorMessage name="role" component="div" className="text-danger" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
