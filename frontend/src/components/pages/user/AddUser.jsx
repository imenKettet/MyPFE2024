import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { userService } from "../../../services/user";
import Loading from "../../reusedComponents/Loading";
import PageContainer from "../../reusedComponents/PageContainer";

const AddUser = () => {
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  return (
    <PageContainer title='Ajouter un employée' path='/list-users' btnColor="dark" btntxt='Retour' >

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
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required('Required'),
          lastName: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
          phone: Yup.string().required('Required'),
          adress: Yup.string().required('Required'),
          role: Yup.string().required('Required'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setLoading(true)
            const response = await userService.addOne(values);
            toast.success(response.data.message);
            Navigate("/list-users");
            setLoading(false)
          } catch (error) {
            console.log(error);
            if (error.response.status === 400) {
              setLoading(false)
              toast.error(error.response.data.message);
            }
          } finally {
            setLoading(false)
            setSubmitting(false);
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
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Nom</label>
              <Field type="text" name="lastName" className="form-control" />
              <ErrorMessage name="lastName" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Prénom</label>
              <Field type="text" name="firstName" className="form-control" />
              <ErrorMessage name="firstName" component="div" className="text-danger" />
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
              <label htmlFor="email" className="form-label">Adresse email</label>
              <Field type="email" name="email" className="form-control" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <Field type="password" name="password" className="form-control" />
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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {loading ? <Loading text='Ajout en cours...' /> : 'Ajouter'}
            </button>
          </form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default AddUser;