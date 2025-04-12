import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('/api/dashboard/classes', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setClasses(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch classes');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const handleSessionAction = async (classId) => {
        setProcessing(prev => ({ ...prev, [classId]: true }));
        try {
            const response = await axios.post(`/api/session/create/${classId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Update the class list to reflect the session status change
            setClasses(classes.map(cls => {
                if (cls.id === classId) {
                    const isActive = response.data.message.includes('created successfully') ||
                        response.data.message.includes('already active');
                    return {
                        ...cls,
                        has_active_session: isActive,
                        active_session_id: response.data.session_id || cls.active_session_id,
                        message: response.data.message
                    };
                }
                return cls;
            }));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to manage session');
        } finally {
            setProcessing(prev => ({ ...prev, [classId]: false }));
        }
    };

    if (loading) return <div className="text-center mt-10">Loading classes...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Classes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
                        <img
                            src={` http://127.0.0.1:3000/`+classItem.image}
                            alt={classItem.name}
                            className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />

                        <h2 className="text-xl font-semibold mb-2">{classItem.name}</h2>
                        <p className="text-gray-600 mb-4">{classItem.description}</p>

                        {classItem.message && (
                            <div className={`p-3 rounded mb-3 ${classItem.has_active_session ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {classItem.message}
                            </div>
                        )}

                        <div className="flex items-center mb-4">
                            <span className="mr-2">Session Status:</span>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${classItem.has_active_session ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {classItem.has_active_session ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {classItem.has_active_session ? (
                                <>
                                    <button
                                        onClick={() => navigate(`/class/${classItem.active_session_id}/detect`)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                    >
                                        Go to Face Detection
                                    </button>
                                    <button
                                        onClick={() => handleSessionAction(classItem.id)}
                                        disabled={processing[classItem.id]}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                    >
                                        {processing[classItem.id] ? 'Stopping...' : 'Stop Session'}
                                    </button>
                                    <button
                                        onClick={() => navigate(`/session/${classItem.active_session_id}`)}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                    >
                                        Go to Dashboard
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleSessionAction(classItem.id)}
                                    disabled={processing[classItem.id]}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                                >
                                    {processing[classItem.id] ? 'Starting...' : 'Start Session'}
                                </button>
                            )}
                        </div>

                        {classItem.active_session_id && (
                            <div className="mt-4 p-3 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">Session ID:</p>
                                <code className="text-sm break-all">{classItem.active_session_id}</code>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassList;