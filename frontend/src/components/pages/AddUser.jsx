import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { userService } from "../../services/user";

const AddUser = () => {
  const Navigate = useNavigate();
  return (
    <div className="container-fluid">
      <div className="card ">
        <div className="card-body">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              phone: "",
              adress: "",
              role: "employe",
            }}
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
              if (!values.password) {
                errors.password = "Requis";
              } else if (values.password.length < 6) {
                errors.password =
                  "le mot de passe doit supérieure ou égale a 6 caractères";
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
                const response = await userService.addOne(values);
                toast.success(response.data.message);
                Navigate("/ListUser");
              } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                  toast.error(error.response.data.message);
                }
              }
            }}
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
                  <h4 className=" text-center fw-bolder">Nouveau Employé </h4>
                  <label htmlFor="lastName" className="form-label">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-control"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.lastName && touched.lastName && errors.lastName}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-control"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.firstName && touched.firstName && errors.firstName}
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
                  />
                  <div className="text-danger">
                    {errors.adress && touched.adress && errors.adress}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.email && touched.email && errors.email}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="text-danger">
                    {errors.password && touched.password && errors.password}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    id="role"
                    className="form-select"
                    aria-label="Default select example"
                    name="role"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                  Enregistrer
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddUser;

// style={{
//   background: "#F27438",
//   border: "none",
// }}
