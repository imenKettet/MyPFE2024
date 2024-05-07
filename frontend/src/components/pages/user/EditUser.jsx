import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { userService } from "../../../services/user";
import PageContainer from "../../reusedComponents/PageContainer";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";

const EditUser = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
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
    <PageContainer title='Modifier un employée' path='/list-users' btnColor="dark" btntxt='Retour' >

      <Formik
        initialValues={{
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          phone: user?.phone || "",
          adress: user?.adress || "",
          email: user?.email || "",
          role: user?.role || "",
          password: "",
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Prénom requis'),
          lastName: Yup.string().required('Nom requis'),
          email: Yup.string().email('Adresse e-mail invalide').required('E-mail requis'),
          password: Yup.string().when('$passwordNotEmpty', (passwordNotEmpty, schema) => {
            return passwordNotEmpty && passwordNotEmpty.length >= 1 && passwordNotEmpty.length <= 5
              ? schema.min(6, 'Le mot de passe doit comporter au moins 6 caractère')
              : schema;
          }),
          phone: Yup.string().required('Téléphone requis'),
          adress: Yup.string().required('Adresse requise'),
          role: Yup.string().required('Rôle requis'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setLoading(true)
            const shouldSave = await confirmSaveChanges();
            if (shouldSave.isConfirmed) {
              if (!values.password) {
                values.password = user.password;
              }
              const response = await userService.updateOne(id, values);
              toast.success(response.data.message);
              Navigate("/list-users");
              setLoading(false)
            } else if (shouldSave.isDenied) {
              Navigate("/list-users");
              setLoading(false)
            }
          } catch (error) {
            setLoading(false)
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
              <label htmlFor="lastName" className="form-label">Nom</label>
              <Field type="text" name="lastName" className="form-control" placeholder="Nom" />
              <ErrorMessage name="lastName" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Prénom</label>
              <Field type="text" name="firstName" className="form-control" placeholder="Prénom" />
              <ErrorMessage name="firstName" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Téléphone</label>
              <Field type="number" name="phone" className="form-control" placeholder="Téléphone" />
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="adress" className="form-label">Adresse</label>
              <Field type="text" name="adress" className="form-control" placeholder="Adresse" />
              <ErrorMessage name="adress" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Adresse email</label>
              <Field type="email" name="email" className="form-control" placeholder="Adresse email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <Field type="password" name="password" className="form-control" placeholder="*******" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <Field as="select" name="role" className="form-select">
                <option value="employe">Employe</option>
                <option value="chef">Chef d'equipe</option>
              </Field>
              <ErrorMessage name="role" component="div" className="text-danger" />
            </div>
            <Button type='submit' btntxt={<>{loading ? <Loading text='Modification en cours...' /> : 'Valider'}</>} btnColor='primary' />
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default EditUser;
