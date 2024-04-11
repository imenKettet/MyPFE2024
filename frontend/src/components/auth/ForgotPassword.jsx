import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";

function ForgotPassword() {
  const Navigate = useNavigate();
  return (
    <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <Formik
                  initialValues={{ email: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = "Requis";
                    } else if (
                      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        values.email
                      )
                    ) {
                      errors.email = "Invalid email address";
                    }
                    return errors;
                  }}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      const response = await axios.post(
                        "http://localhost:4000/auth/forgotPassword",
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
                      <div className="mb-3">
                        <h2 className="text-center">Trouvez votre compte</h2>
                        <hr />
                        <label htmlFor="exampleInputEmail1" className=" h5">
                          Veuillez entrer votre e-mail pour rechercher votre
                          compte.
                        </label>
                        <input
                          type="email"
                          placeholder="Entrer votre email"
                          className="form-control"
                          name="email"
                          aria-describedby="emailHelp"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <div className="text-danger">
                          {errors.email && touched.email && errors.email}
                        </div>
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
                          className="btn btn-dark   py-8 fs-4 mb-4 rounded-2"
                          disabled={isSubmitting}
                          style={{
                            background: "#F27438",
                            border: "none",
                          }}
                          //onclick="this.disabled = true;"
                        >
                          Rechercher
                        </button>
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

export default ForgotPassword;
