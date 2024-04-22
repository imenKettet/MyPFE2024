import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, ErrorMessage, Field } from "formik";
import Select from "react-select";
import toast from "react-hot-toast";
import { absenceService } from "../../../services/absence";
import { userService } from "../../../services/user";
import Button from "../../reusedComponents/Button";
import Loading from "../../reusedComponents/Loading";
import PageContainer from "../../reusedComponents/PageContainer";
import * as Yup from "yup";

const UpdateAbsence = () => {
    const { id } = useParams();
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [employeUsers, setEmployeUsers] = useState([]);
    const [selectedEmploye, setSelectedEmploye] = useState("");
    const [absenceData, setAbsenceData] = useState(null);

    const fetchAbsenceData = async () => {
        try {
            const response = await absenceService.getOne(id);
            setAbsenceData(response.data);
            setSelectedEmploye({
                value: response.data.employe._id,
                label: `${response.data.employe.firstName} ${response.data.employe.lastName}`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userService.getall();
            setEmployeUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const selectEmploye = (e) => {
        setSelectedEmploye(e);
    };

    useEffect(() => {
        fetchAbsenceData();
        fetchUsers();
        // eslint-disable-next-line
    }, []);

    // Define Yup schema for validation
    const validationSchema = Yup.object().shape({
        date: Yup.string().required("Date est requis"),
        employe: Yup.object().shape({
            value: Yup.string().required("Employé est requis"),
            label: Yup.string(), // Add any additional validation rules for the label if needed
        }),
        absenceType: Yup.string().required("Type d'absence est requis"),
    });

    return (
        <PageContainer title={"Modifier une absence"}>
            {absenceData && (
                <Formik
                    initialValues={{
                        date: absenceData.date,
                        employe: selectedEmploye,
                        absenceType: absenceData.absenceType,
                        duration: absenceData.duration,
                    }}
                    validationSchema={validationSchema} // Pass the validation schema
                    onSubmit={async (values) => {
                        try {
                            setLoading(true);
                            if (selectedEmploye === null) {
                                toast.error("Veuillez sélectionner un employé!");
                                setLoading(false);
                                return;
                            }
                            values.absenceType === "Toute la journée" &&
                                (values.duration = 8);
                            values.absenceType === "Demi journée" &&
                                (values.duration = 4);
                            values.employe = selectedEmploye.value;
                            await absenceService.updateOne(id, values);
                            toast.success("Absence mise à jour avec succès");
                            Navigate("/ListAbsences");
                            setLoading(false);
                        } catch (error) {
                            setLoading(false);
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
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="date" className="form-label">
                                    Date
                                </label>
                                <input
                                    id="date"
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.date}
                                />
                                <ErrorMessage
                                    name="date"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="empolyeSelect" className="form-label">
                                    Employé
                                </label>
                                <Select
                                    id="empolyeSelect"
                                    name="empolye"
                                    options={employeUsers.map((user) => ({
                                        value: user._id,
                                        label: `${user.firstName} ${user.lastName}`,
                                    }))}
                                    value={selectedEmploye}
                                    onChange={selectEmploye}
                                />
                                <ErrorMessage
                                    name="employe"
                                    component="div"
                                    className="text-danger"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="absenceType" className="form-label">
                                    Type d'absence
                                </label>
                                <select
                                    id="absenceType"
                                    className="form-select"
                                    name="absenceType"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.absenceType}
                                >
                                    <option value="Toute la journée"> Toute la journée</option>
                                    <option value="Demi journée"> Demi-Journée </option>
                                    <option value="Autorisation"> Autorisation </option>
                                </select>
                                <ErrorMessage
                                    name="absenceType"
                                    component="div"
                                    className="text-danger"
                                />
                                {values.absenceType === "Autorisation" && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="duration" className="form-label">
                                                Durée
                                            </label>
                                            <Field
                                                id="duration"
                                                type="number"
                                                className="form-control"
                                                name="duration"
                                                min={1}
                                                max={7}
                                            />
                                            <ErrorMessage
                                                name="duration"
                                                component="div"
                                                className="text-danger"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <Button
                                type="submit"
                                btntxt={
                                    <>
                                        {loading ? (
                                            <Loading text="Enregistrement en cours..." />
                                        ) : (
                                            "Enregistrer"
                                        )}
                                    </>
                                }
                                btnColor="primary"
                            />
                        </form>
                    )}
                </Formik>
            )}
        </PageContainer>
    );
};

export default UpdateAbsence;
