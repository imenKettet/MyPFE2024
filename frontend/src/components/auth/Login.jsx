import React, { useState } from "react";
// import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { useCookies } from "react-cookie";
const oneDayInSeconds = 24 * 60 * 60;

const Login = () => {
  const [cookies, setCookie] = useCookies();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const Navigate = useNavigate();
  return (
    <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center w-100">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 col-lg-6 col-xxl-3">
            <div className="card mb-0">
              <div className="card-body">
                <Link
                  to="/"
                  className="text-nowrap logo-img text-center d-block py-3 w-100"
                >
                  <img src="img/logo/logo.png" width="180" alt="" />
                </Link>

                <Formik
                  initialValues={{ email: "", password: "" }}
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
                        "http://localhost:4000/auth",
                        values
                      );
                      if (
                        response.data.role === "employe" ||
                        response.data.role === "chef"
                      ) {
                        Navigate("/my-team");
                      } else {
                        Navigate("/");
                      }
                      toast.success(response.data.message);
                      setCookie("token", response.data.token, {
                        maxAge: oneDayInSeconds,
                      });
                      localStorage.setItem("role", response.data.role);
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
                        <i className="ti ti-user h5 me-2"></i>
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Email
                        </label>
                        <input
                          id="exampleInputEmail1"
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
                      <div className="mb-4">
                        <i className="ti ti-lock h5 me-2"></i>
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          Mot de passe
                        </label>

                        <div className="input-group">
                          <input
                            id="exampleInputPassword1"
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <button
                            className="btn text-dark border border-2 ms-0"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <i className="ti ti-eye" />
                            ) : (
                              <i className="ti ti-eye-off" />
                            )}
                          </button>
                        </div>
                        <div className="text-danger">
                          {errors.password &&
                            touched.password &&
                            errors.password}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="form-check">
                          <input
                            className="form-check-input primary"
                            type="checkbox"
                            value=""
                            id="flexCheckChecked"
                          />
                          <label
                            className="form-check-label text-dark"
                            htmlFor="flexCheckChecked"
                          >
                            Mémoriser
                          </label>
                        </div>
                        <Link
                          className="text-dark fw-bold "
                          to="/ForgotPassword"
                        >
                          Mot de passe oublié ?
                        </Link>
                      </div>
                      <button
                        type="submit"
                        className="btn text-white w-100 py-8 fs-4 mb-4 rounded-2 btn-lg btn-block "
                        style={{
                          background:
                            "linear-gradient(to right, #ee7724, #d8363a,#d8363a, #ee7724 )",
                        }}
                        disabled={isSubmitting}
                      >
                        Se connecter
                      </button>
                    </form>
                  )}
                </Formik>
                <div className="d-none">{JSON.stringify(cookies)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
