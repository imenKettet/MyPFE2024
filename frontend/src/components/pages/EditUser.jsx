import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { userService } from "../../services/user";

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
            validate={(values) => {
              const errors = {};
              if (!values.firstName) {
                errors.firstName = "Requis";
              }
              if (!values.lastName) {
                errors.lastName = "Requis";
              }
              if (!values.email) {
                errors.email = "Requis";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              if (!values.phone) {
                errors.phone = "Requis";
              }
              if (!values.adress) {
                errors.adress = "Requis";
              }
              if (!values.role) {
                errors.adress = "Requis";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              try {
                const shouldSave = await confirmSaveChanges();
                if (shouldSave.isConfirmed) {
                  const response = await userService.updateOne(id, values);
                  toast.success(response.data.message);
                  Navigate("/ListUser");
                } else if (shouldSave.isDenied) {
                  Navigate("/ListUser");
                }
              } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                  toast.error(error.response.data.message);
                }
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
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Nom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-control"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                  />
                  <div className="text-danger">
                    {errors.firstName && touched.firstName && errors.firstName}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Prénom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-control"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                  />
                  <div className="text-danger">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    type="number"
                    className="form-control"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                  <div className="text-danger">
                    {errors.phone && touched.phone && errors.phone}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="adress" className="form-label">
                    Adresse
                  </label>
                  <input
                    id="adress"
                    type="text"
                    className="form-control"
                    name="adress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.adress}
                  />
                  <div className="text-danger">
                    {errors.adress && touched.adress && errors.adress}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="Email" className="form-label">
                    Email
                  </label>
                  <input
                    id="Email"
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <div className="text-danger">
                    {errors.email && touched.email && errors.email}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    name="role"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.role}
                  >
                    <option value="employe"> Employe </option>
                    <option value="chef">Chef d'equipe </option>
                  </select>
                  <div className="text-danger">
                    {errors.role && touched.role && errors.role}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary py-8 fs-4 mb-4 rounded-2"
                  disabled={isSubmitting}
                  style={{
                    margin: "0 auto",
                    display: "block",
                    width: "200px",
                  }}
                >
                  Valider
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
