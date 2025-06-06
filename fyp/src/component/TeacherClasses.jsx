import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeacherClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherClasses = async () => {
            try {
                // Get the token from localStorage
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('/api/teacher/list-all', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                setClasses(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('Error fetching classes:', err);
            }
        };

        fetchTeacherClasses();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 text-lg font-medium text-gray-600">Loading classes...</p>
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
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-primary">Your Classes</h2>
                <Link to="/classes/create" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Class
                </Link>
            </div>

            {classes.length === 0 ? (
                <div className="card bg-base-200 shadow-xl p-8">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <h3 className="mt-4 text-xl font-semibold">No Classes Found</h3>
                        <p className="mt-2 text-gray-600">Get started by creating your first class!</p>
                        <Link to="/classes/create" className="btn btn-primary mt-4">Create Class</Link>
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
                                <div className="badge badge-accent mb-2">{cls.students?.length || 0} Students</div>
                                <p className="text-gray-600 line-clamp-3">{cls.description}</p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/stats/${cls.id}/sessions`} className="btn btn-primary">
                                        View Stats
                                    </Link>
                                    <Link to={`/classes/${cls.id}`} className="btn btn-primary">
                                        See Class
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