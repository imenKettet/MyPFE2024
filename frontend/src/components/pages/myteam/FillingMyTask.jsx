import React, { useState } from 'react'
import PageContainer from '../../reusedComponents/PageContainer';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom'
import { taskService } from '../../../services/task'
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";
const FillingMyTask = () => {
    const Navigate = useNavigate();
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const validationSchema = Yup.object().shape({
        startTime: Yup.string().required('L\'heure de début est requise'),
        endTime: Yup.string()
            .required('L\'heure de fin est requise')
            .when('startTime', (startTime, schema) => (
                startTime &&
                schema.test({
                    test: function (endTime) {
                        if (!endTime) return true;
                        const start = new Date(`2000-01-01T${startTime}`);
                        const end = new Date(`2000-01-01T${endTime}`);
                        return end > start;
                    },
                    message: 'L\'heure de fin doit être supérieure à l\'heure de début'
                })
            )),
        dateWorked: Yup.string()
            .required('La date du travail est requise'),
        Status: Yup.string().required('Le statut est requis')
    });

    const initialValues = {
        startTime: '',
        endTime: '',
        dateWorked: '',
        Status: 'En cours'
    };
    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const response = await taskService.fillTask(id, values)
            toast.success(response.data.message);
            Navigate('/myTasks')
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <PageContainer title={"Remplir la tâche"} >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(values) => (
                    <Form className='gap-3 d-flex flex-column'>
                        <div>
                            <label htmlFor="startTime">Heure de début</label>
                            <Field className="form-control" type="time" name="startTime" />
                            <ErrorMessage name="startTime" className='text-danger' component="div" />
                        </div>
                        <div>
                            <label htmlFor="endTime">Heure de fin</label>
                            <Field className="form-control" type="time" name="endTime" />
                            <ErrorMessage name="endTime" className='text-danger' component="div" />
                        </div>
                        <div>
                            <label htmlFor="dateWorked">Date du travail</label>
                            <Field className="form-control" type="date" name="dateWorked" />
                            <ErrorMessage name="dateWorked" className='text-danger' component="div" />
                        </div>
                        <div>
                            <label htmlFor="Status">Statut</label>
                            <Field as="select" name="Status" className="form-control">
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                            </Field>
                            <ErrorMessage name="Status" className='text-danger' component="div" />
                        </div>
                        <Button type='submit' btntxt={<>{loading ? <Loading text='Enregistrement en cours...' /> : 'Enregistrer'}</>} btnColor='primary' />
                        {JSON.stringify(values)}
                    </Form>
                )}
            </Formik>

        </PageContainer>
    )
}

export default FillingMyTask