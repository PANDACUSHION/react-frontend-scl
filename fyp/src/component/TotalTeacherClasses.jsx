import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const TeacherClasses = () => {
    const { id: teacherId } = useParams();  // extract `id` from the URL
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found');

                const response = await axios.get(`/api/teacher/list-all/${teacherId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setClasses(response.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherClasses();
    }, [teacherId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
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
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Classes of Teacher ID: {teacherId}</h2>
            </div>

            {classes.length === 0 ? (
                <div className="card bg-base-200 shadow-xl p-8">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold">No Classes Found</h3>
                        <p className="mt-2 text-gray-600">This teacher has not created any classes.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div key={cls.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                            <figure className="px-4 pt-4">
                                {cls.image ? (
                                    <img src={` http://127.0.0.1:3000/`+cls.image} alt={cls.name} className="rounded-xl h-48 w-full object-cover" />
                                ) : (
                                    <div className="bg-gradient-to-r from-primary to-secondary h-48 w-full rounded-xl flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">{cls.name.charAt(0)}</span>
                                    </div>
                                )}
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-xl font-bold">{cls.name}</h3>
                                <p className="text-gray-600 line-clamp-3">{cls.description}</p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/admin/${cls.id}`} className="btn btn-primary">
                                        View Stats
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherClasses;
