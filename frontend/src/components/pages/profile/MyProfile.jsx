import React, { useContext, useEffect, useState } from 'react'
import { userService } from '../../../services/user'
import { CoockieContext } from '../../../features/contexts'
import { Formik } from 'formik'
import { toast } from 'react-hot-toast'
import PageContainer from '../../reusedComponents/PageContainer'
const MyProfile = () => {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({})
  const Context = useContext(CoockieContext)

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userService.getOne(Context.id)
      setProfile(response.data)
    }
    fetchProfile()
  }, [Context.id])
  return (
    <PageContainer title='Mon profile'>
      <Formik
        initialValues={profile ? profile : {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          adress: '',
          phone: ''
        }}
        validate={(values) => {
          const errors = {};
          if (!values.firstName) {
            errors.firstName = 'Nom est obligatoire';
          }
          if (!values.lastName) {
            errors.lastName = 'Prénom est obligatoire';
          }
          if (!values.adress) {
            errors.adress = 'Adresse est obligatoire';
          }
          if (!values.phone) {
            errors.phone = 'Téléphone est obligatoire';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const response = await userService.updateOne(profile._id, values)
            toast.success(response.data.message)
          } catch (error) {
            toast.warning(error.response.data.message)
          }
          setLoading(false);
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
          <form className='row' onSubmit={handleSubmit}>
            <div className="mb-3 col-12">
              <span htmlFor="firstName" className="text-muted">
                Créé le: {formatDate(profile.createdAt)}
              </span>
            </div>
            <div className="col-sm-6 col-xs-12">
              <label htmlFor="firstName" className="form-label">
                Nom
              </label>
              <input type="text" value={values.firstName || ''} onChange={handleChange} onBlur={handleBlur} name="firstName" className="form-control" />
              <p className="text-danger" > {errors.firstName && touched.firstName && errors.firstName}</p>
            </div>
            <div className="col-sm-6 col-xs-12">
              <label htmlFor="lastName" className="form-label">
                Prénom
              </label>
              <input type="text" value={values.lastName || ''} onChange={handleChange} onBlur={handleBlur} className="form-control" id="lastName" />
              <p className="text-danger" > {errors.lastName && touched.lastName && errors.lastName}</p>

            </div>
            <div className="mb-3 col-12">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input type="email" value={values.email || ''} onChange={handleChange} onBlur={handleBlur} className="form-control cursor-not-allowed" id="email" disabled />
            </div>
            <div className="mb-3 col-12">
              <label htmlFor="password" className="form-label">
                Mot de passe: <span className='text-muted' style={{ fontSize: '10px' }}> optionel</span>
              </label>
              <input type="password" value={values.password || ''} onChange={handleChange} onBlur={handleBlur} className="form-control" id="password" />
            </div>
            <div className="mb-3 col-12">
              <label htmlFor="adress" className="form-label">
                Adresse:
              </label>
              <input type="text" value={values.adress || ''} onChange={handleChange} onBlur={handleBlur} className="form-control" id="adress" />
            </div>
            <div className="mb-3 col-12">
              <label htmlFor="phone" className="form-label">
                Phone:
              </label>
              <input type="phone" value={values.phone || ''} onChange={handleChange} onBlur={handleBlur} className="form-control" id="phone" />
            </div>

            <div className='d-flex justify-content-end mb-4'>
              <button
                className='btn btn-primary ms-auto'
                type='submit'
                disabled={loading}
              >
                {loading ? <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Saving...</> : <><i className="ti ti-device-floppy" style={{ fontSize: '16px' }}></i>&nbsp;<span style={{ fontSize: '16px' }}>Sauvegarder</span></>}
              </button>
            </div>
          </form>)}
      </Formik>
    </PageContainer>
  )
}

export default MyProfile
