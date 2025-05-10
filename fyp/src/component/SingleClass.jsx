import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BulkAddStudentsForm from "./BulkStudent.jsx";
import SessionManager from "./SessionManager.jsx";

function SingleClass() {
    const { id } = useParams();
    const [classroom, setClassroom] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClassDetails = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`/api/student/classes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setClassroom(response.data);
                setIsLoading(false);
            } catch (error) {
                setError('Class not found or error fetching class details.');
                setIsLoading(false);
                console.error(error);
            }
        };

        fetchClassDetails();
    }, [id]);

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg font-medium text-gray-600">Loading class details...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="alert alert-error max-w-lg shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="font-bold">Error!</h3>
                    <div className="text-sm">{error}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="card bg-base-100 shadow-xl">
                <figure className="relative h-64 lg:h-80">
                    {classroom.image ? (
                        <img
                            src={` http://127.0.0.1:3000/`+classroom.image}
                            alt={classroom.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-primary to-secondary w-full h-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">{classroom.name.charAt(0)}</span>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6">
                        <h2 className="text-3xl font-bold mb-2">{classroom.name}</h2>
                        <div className="flex items-center gap-2">
                            <div className="badge badge-primary">{classroom.students?.length || 0} Students</div>
                            <div className="text-sm opacity-90">Created: {new Date(classroom.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                </figure>

                <div className="card-body">
                    <div className="divider">Class Information</div>

                    <div className="bg-base-200 p-6 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{classroom.description || "No description provided."}</p>
                    </div>

                    <div className="stats shadow mb-6">

                        {classroom.last_activity && (
                            <div className="stat">
                                <div className="stat-title">Last Activity</div>
                                <div className="stat-value text-lg">{new Date(classroom.last_activity).toLocaleString()}</div>
                            </div>
                        )}
                    </div>

                    <div className="divider">Manage Students</div>

                    <div className="bg-base-200 p-6 rounded-lg">
                        <BulkAddStudentsForm classId={id} />
                        <SessionManager classId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleClass;