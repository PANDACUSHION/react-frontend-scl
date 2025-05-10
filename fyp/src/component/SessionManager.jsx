import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SessionManager = () => {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [processing, setProcessing] = useState(false);

    const checkSessionStatus = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/session/create/${id}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setMessage(res.data.message);

            // Check if session exists and is active
            if (res.data.message === 'Session is already active.') {
                setIsActive(true);
                setSessionId(res.data.session_id);
            }
            // Check if session exists but is inactive or no session exists
            else {
                setIsActive(false);
                if (res.data.session_id) {
                    setSessionId(res.data.session_id);
                } else {
                    setSessionId('');
                }
            }

            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Error checking session status');
            setIsActive(false);
            setSessionId('');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSessionStatus();
    }, [id]);

    const handleSessionAction = async () => {
        setProcessing(true);
        try {
            const res = await axios.post(`/api/session/create/${id}`, {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setMessage(res.data.message);
            setSessionId(res.data.session_id || '');

            // Update active status based on response
            if (res.data.message.includes('deactivated')) {
                setIsActive(false);
            } else if (res.data.message.includes('created successfully')) {
                setIsActive(true);
            }

            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to manage session');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading session info...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Classroom Session Manager</h2>

            <p className="mb-2 text-gray-600">Classroom ID: <code>{id}</code></p>

            {message && (
                <div className={`p-3 rounded mb-3 ${isActive ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {message}
                </div>
            )}

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-3">{error}</div>}

            <div className="flex items-center mb-4">
                <span className="mr-2">Session Status:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="space-y-3">
                {isActive ? (
                    <>
                        <button
                            onClick={() => window.location.href = `/class/${sessionId}/detect`}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Go to Face Detection
                        </button>
                        <button
                            onClick={() => window.location.href = `/class/${sessionId}/uploadVideo`}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                           Upload Video
                        </button>
                        <button
                            onClick={handleSessionAction}
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            {processing ? 'Stopping...' : 'Stop Session'}
                        </button>
                        <button
                            onClick={() => window.location.href = `/session/${sessionId}`}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleSessionAction}
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            {processing ? 'Starting...' : 'Start Session'}
                        </button>
                    </>
                )}
            </div>

            {sessionId && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Session ID:</p>
                    <code className="text-sm break-all">{sessionId}</code>
                </div>
            )}
        </div>
    );
};

export default SessionManager;
