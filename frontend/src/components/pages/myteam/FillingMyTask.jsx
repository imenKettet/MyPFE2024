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
        startTime: Yup.string().required('Start time is required'),
        endTime: Yup.string()
            .required('End time is required')
            .when('startTime', (startTime, schema) => (
                startTime &&
                schema.test({
                    test: function (endTime) {
                        if (!endTime) return true; // Allow empty value for end time
                        const start = new Date(`2000-01-01T${startTime}`);
                        const end = new Date(`2000-01-01T${endTime}`);
                        return end > start;
                    },
                    message: 'End time must be greater than start time'
                })
            )),
        dateWorked: Yup.string()
            .required('Date worked is required')
    });

    const initialValues = {
        startTime: '',
        endTime: '',
        dateWorked: ''
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
                        <Button type='submit' btntxt={<>{loading ? <Loading text='Enregistrement en cours...' /> : 'Enregistrer'}</>} btnColor='primary' />
                        {JSON.stringify(values)}
                    </Form>
                )}
            </Formik>

        </PageContainer>
    )
}

export default FillingMyTask