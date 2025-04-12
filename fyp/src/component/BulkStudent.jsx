import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { PlusCircle, MinusCircle, Send } from 'lucide-react';
import CourseStudentsViewer from "./CourseStudentViewer.jsx";

const BulkAddStudentsForm = () => {
    const { id: classId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [emailDomain, setEmailDomain] = useState('school.edu');
    const [students, setStudents] = useState([{ firstName: '', lastName: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...students];
        updatedStudents[index][field] = value;
        setStudents(updatedStudents);
    };

    const addStudentField = () => {
        setStudents([...students, { firstName: '', lastName: '' }]);
    };

    const removeStudentField = (index) => {
        if (students.length > 1) {
            const updatedStudents = [...students];
            updatedStudents.splice(index, 1);
            setStudents(updatedStudents);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                students: students.map(student => ({
                    first_name: student.firstName.trim(),
                    last_name: student.lastName.trim()
                })),
                email_domain: emailDomain.trim()
            };

            const response = await axios.post(
                `/api/student/${classId}/bulk_create`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            enqueueSnackbar('Students added successfully!', { variant: 'success' });
        } catch (error) {
            console.error('Error adding students:', error);
            enqueueSnackbar(error.response?.data?.message || 'Failed to add students', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Bulk Add Students to Class</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Email Domain</span>
                    </label>
                    <input
                        type="text"
                        placeholder="school.edu"
                        className="input input-bordered w-full"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                    />
                    <label className="label">
                        <span className="label-text-alt">Emails will be generated as firstname.lastname@domain</span>
                    </label>
                </div>

                <div className="divider">Student Information</div>

                {students.map((student, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input input-bordered"
                                value={student.firstName}
                                onChange={(e) => handleStudentChange(index, 'firstName', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-control flex-1">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-bordered"
                                value={student.lastName}
                                onChange={(e) => handleStudentChange(index, 'lastName', e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeStudentField(index)}
                            className="btn btn-ghost btn-sm text-error"
                            disabled={students.length <= 1}
                        >
                            <MinusCircle className="w-5 h-5" />
                        </button>
                        {index === students.length - 1 && (
                            <button
                                type="button"
                                onClick={addStudentField}
                                className="btn btn-ghost btn-sm text-primary"
                            >
                                <PlusCircle className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                ))}

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Add Students
                            </>
                        )}
                    </button>
                </div>
            </form>
            <CourseStudentsViewer />
        </div>
    );
};

export default BulkAddStudentsForm;