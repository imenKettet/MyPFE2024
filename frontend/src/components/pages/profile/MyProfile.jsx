import React, { useContext, useEffect, useState } from "react";
import { userService } from "../../../services/user";
import { CoockieContext } from "../../../features/contexts";
import { Formik, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import Swal from "sweetalert2";
import PageContainer from "../../reusedComponents/PageContainer";
import Loading from "../../reusedComponents/Loading";
import Button from "../../reusedComponents/Button";
const MyProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const Context = useContext(CoockieContext);
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("fr-FR", options);
  };
  const confirmSaveChanges = () => {
    return Swal.fire({
      title: "Voulez-vous enregistrer les modifications?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Oui",
      denyButtonText: `Non`,
    });
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userService.getOne(Context.id);
      setProfile(response.data);
    };
    fetchProfile();
  }, [Context.id]);
  return (
    <PageContainer title="Mon profile">
      <Formik
        initialValues={{
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          phone: profile?.phone || "",
          adress: profile?.adress || "",
          email: profile?.email || "",
          role: profile?.role || "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required("Prénom requis"),
          lastName: Yup.string().required("Nom requis"),
          email: Yup.string()
            .email("Adresse e-mail invalide")
            .required("E-mail requis"),
          password: Yup.string().when(
            "$passwordNotEmpty",
            (passwordNotEmpty, schema) => {
              return passwordNotEmpty &&
                passwordNotEmpty.length >= 1 &&
                passwordNotEmpty.length <= 5
                ? schema.min(
                    6,
                    "Le mot de passe doit comporter au moins 6 caractère"
                  )
                : schema;
            }
          ),
          phone: Yup.string().required("Téléphone requis"),
          adress: Yup.string().required("Adresse requise"),
          role: Yup.string().required("Rôle requis"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setLoading(true);
            const shouldSave = await confirmSaveChanges();
            if (shouldSave.isConfirmed) {
              if (!values.password) {
                values.password = profile.password;
              }
              const response = await userService.updateOne(Context.id, values);
              toast.success(response.data.message);
              setLoading(false);
            } else if (shouldSave.isDenied) {
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            if (error.response.status === 400) {
              toast.error(error.response.data.message);
            }
            console.log(error);
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
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <span htmlFor="firstName" className="text-muted">
                Créé le: {formatDate(profile.createdAt)}
              </span>
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Nom
              </label>
              <Field
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Nom"
              />
              <ErrorMessage
                name="lastName"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                Prénom
              </label>
              <Field
                type="text"
                name="firstName"
                className="form-control"
                placeholder="Prénom"
              />
              <ErrorMessage
                name="firstName"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Téléphone
              </label>
              <Field
                type="number"
                name="phone"
                className="form-control"
                placeholder="Téléphone"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="adress" className="form-label">
                Adresse
              </label>
              <Field
                type="text"
                name="adress"
                className="form-control"
                placeholder="Adresse"
              />
              <ErrorMessage
                name="adress"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <Field
                type="email"
                name="email"
                className="form-control"
                placeholder="Adresse email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="*******"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            {/* <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <Field as="select" name="role" className="form-select">
                <option value="employe">Employe</option>
                <option value="chef">Chef d'equipe</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-danger" />
            </div> */}
            <Button
              type="submit"
              btntxt={
                <>
                  {loading ? (
                    <Loading text="Modification en cours..." />
                  ) : (
                    "Valider"
                  )}
                </>
              }
              btnColor="primary"
            />
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default MyProfile;
