import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";

function ResetPassword() {
  const Navigate = useNavigate();
  const { token } = useParams();
  return (
    <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <Formik
                  initialValues={{ password: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.password) {
                      errors.password = "Requis";
                    } else if (values.password.length < 6) {
                      errors.password =
                        "le mot de passe doit supérieure ou égale a 6 caractères";
                    }
                    return errors;
                  }}
                  onSubmit={async (values) => {
                    try {
                      const response = await axios.post(
                        `http://localhost:4000/auth/reset-password/${token}`,
                        values
                      );
                      toast.success(response.data.message);
                      Navigate("/login");
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
                      <div className="mb-4">
                        <h3>Choisissez un nouveau mot de passe</h3>
                        <hr />
                        {/* <label htmlFor="exampleInputPassword1" className="h5">
                          Créez un mot de passe d'au moins 6 caractères. Un mot
                          de passe fort est une combinaison de lettres, de
                          chiffres et de signes de ponctuation.
                        </label> */}
                        <input
                          type="password"
                          placeholder="Entrez le nouveau mot de passe"
                          className="form-control"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <div className="text-danger">
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <Link to="/login">
                            <button
                              type="submit"
                              className="btn btn-dark  py-8 fs-4 mb-4 m rounded-2  "
                              disabled={isSubmitting}
                              style={{
                                background: "#F27438",
                                border: "none",
                              }}
                            >
                              Annuler
                            </button>
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-dark py-8 fs-4 mb-4 rounded-2"
                            disabled={isSubmitting}
                            style={{
                              background: "#F27438",
                              border: "none",
                            }}
                          >
                            Réinitialiser
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
