import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { Users, ChevronDown, ChevronUp, Search } from 'lucide-react';

const CourseStudentsViewer = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { id: classId } = useParams(); // Get classId from URL
    const [courseName, setCourseName] = useState('');
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    // Fetch course details and students when component mounts or classId changes
    useEffect(() => {
        if (classId) {
            fetchCourseAndStudents(classId);
        }
    }, [classId]);

    const fetchCourseAndStudents = async (id) => {
        setIsLoading(true);
        try {
            // Then fetch students for this course
            const studentsResponse = await axios.get(`/api/student/course/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setStudents(studentsResponse.data.students);
            enqueueSnackbar(`Found ${studentsResponse.data.students.length} students`, {
                variant: 'success'
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setStudents([]);
            enqueueSnackbar(
                error.response?.data?.detail || 'Failed to fetch course data',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStudents = async () => {
        if (!courseName.trim()) {
            enqueueSnackbar('Please enter a course name', { variant: 'warning' });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`/api/students/course/${courseName}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setStudents(response.data.students);
            enqueueSnackbar(`Found ${response.data.students.length} students`, {
                variant: 'success'
            });
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
            enqueueSnackbar(
                error.response?.data?.detail || 'Failed to fetch students',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    return (
        <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
                {/* Header with toggle button */}
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-xl">
                        <Users className="w-5 h-5 mr-2" />
                        {classId ? `Students in ${courseName}` : 'View Students by Course'}
                    </h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="btn btn-ghost btn-sm"
                    >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>

                {isExpanded && (
                    <>
                        {/* Only show search form if no classId in URL */}
                        {!classId && (
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter course name"
                                        className="input input-bordered w-full"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="loading loading-spinner"></span>
                                        ) : (
                                            <Search className="w-5 h-5" />
                                        )}
                                        Search
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Results Table */}
                        {students.length > 0 && (
                            <div className="mt-6 overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td>
                                                <div className="flex items-center space-x-3">
                                                    <div className="avatar placeholder">
                                                        <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                                                <span className="text-xs">
                                                                    {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                                                </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">
                                                            {student.first_name} {student.last_name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{student.email}</td>
                                            <td>
                                                    <span className={`badge ${student.role === 'teacher' ? 'badge-primary' : 'badge-secondary'}`}>
                                                        {student.role}
                                                    </span>
                                            </td>
                                            <td>
                                                {new Date(student.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Empty State */}
                        {students.length === 0 && (courseName || classId) && !isLoading && (
                            <div className="mt-6 text-center">
                                <div className="alert alert-info">
                                    <span>No students found {classId ? `for this course` : `for course "${courseName}"`}</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseStudentsViewer;