import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaChalkboard, FaCheck, FaSpinner } from 'react-icons/fa';

const SessionLogTable = () => {
    const [sessions, setSessions] = useState([]);
    const [totalSessions, setTotalSessions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('start_time');
    const [sortDirection, setSortDirection] = useState('desc');

    // Behavior icons and colors mapping
    const behaviorInfo = {
        'hand-raising': { color: '#0088FE', label: 'Hand Raising' },
        'reading': { color: '#00C49F', label: 'Reading' },
        'writing': { color: '#FFBB28', label: 'Writing' }
    };

    useEffect(() => {
        const fetchSessionLogs = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('/api/dashboard/session-log', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setSessions(data.sessions);
                setTotalSessions(data.total_sessions);
            } catch (err) {
                console.error('Failed to fetch session logs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionLogs();
    }, []);

    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle direction if same field clicked again
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to descending
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Format date without using date-fns
    const formatDate = (isoString) => {
        try {
            const date = new Date(isoString);
            // Format as "Mon DD, YYYY h:mm AM/PM"
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Filter and sort sessions
    const filteredSessions = sessions
        .filter(session =>
            session.class_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortField === 'start_time') {
                return sortDirection === 'asc'
                    ? new Date(a.start_time) - new Date(b.start_time)
                    : new Date(b.start_time) - new Date(a.start_time);
            } else if (sortField === 'duration_minutes') {
                return sortDirection === 'asc'
                    ? a.duration_minutes - b.duration_minutes
                    : b.duration_minutes - a.duration_minutes;
            } else if (sortField === 'class_name') {
                return sortDirection === 'asc'
                    ? a.class_name.localeCompare(b.class_name)
                    : b.class_name.localeCompare(a.class_name);
            } else if (sortField === 'total_behaviors') {
                const totalA = a.behaviors.reduce((sum, b) => sum + b.count, 0);
                const totalB = b.behaviors.reduce((sum, b) => sum + b.count, 0);
                return sortDirection === 'asc' ? totalA - totalB : totalB - totalA;
            }
            return 0;
        });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-lg mx-auto mt-4 text-sm">
                <span>Error loading session logs: {error}</span>
            </div>
        );
    }

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="container mx-auto px-2 py-10">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Session Logs</h1>
                <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-500">Total: {totalSessions}</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-sm input-bordered max-w-xs"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-base-100 shadow-sm rounded">
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                        <tr className="bg-gray-50">
                            <th
                                onClick={() => handleSort('class_name')}
                                className="text-xs cursor-pointer hover:bg-gray-100"
                            >
                                Class {getSortIcon('class_name')}
                            </th>
                            <th
                                onClick={() => handleSort('start_time')}
                                className="text-xs cursor-pointer hover:bg-gray-100"
                            >
                                Date/Time {getSortIcon('start_time')}
                            </th>
                            {/* <th
                                onClick={() => handleSort('duration_minutes')}
                                className="text-xs cursor-pointer hover:bg-gray-100"
                            >
                                Duration {getSortIcon('duration_minutes')}
                            </th> */}
                            <th className="text-xs">Status</th>
                            <th className="text-xs text-center">Hand Raising</th>
                            <th className="text-xs text-center">Reading</th>
                            <th className="text-xs text-center">Writing</th>
                            <th
                                onClick={() => handleSort('total_behaviors')}
                                className="text-xs cursor-pointer hover:bg-gray-100 text-right"
                            >
                                Total {getSortIcon('total_behaviors')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredSessions.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-4 text-gray-500">
                                    No session logs found
                                </td>
                            </tr>
                        ) : (
                            filteredSessions.map((session) => {
                                const totalBehaviors = session.behaviors.reduce((sum, b) => sum + b.count, 0);

                                return (
                                    <tr key={session.session_id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-2">
                                            <div className="flex items-center">
                                                <FaChalkboard className="mr-1 text-gray-400" size={14} />
                                                <span>{session.class_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-2">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-1 text-gray-400" size={14} />
                                                <span className="text-sm">{formatDate(session.start_time)}</span>
                                            </div>
                                        </td>
                                        {/* <td className="py-2">
                                            <div className="flex items-center">
                                                <FaClock className="mr-1 text-gray-400" size={14} />
                                                <span>{session.duration_minutes} min</span>
                                            </div>
                                        </td> */}
                                        <td className="py-2">
                                            {session.status === 'Active' ? (
                                                <div className="badge badge-sm badge-success gap-1">
                                                    <FaSpinner size={10} className="animate-spin" />
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="badge badge-sm badge-ghost gap-1">
                                                    <FaCheck size={10} />
                                                    Complete
                                                </div>
                                            )}
                                        </td>

                                        {/* Behavior Counts */}
                                        {session.behaviors.map((behavior, index) => (
                                            <td key={index} className="py-2 text-center">
                          <span
                              className="font-medium"
                              style={{ color: behaviorInfo[behavior.behavior]?.color }}
                          >
                            {behavior.count}
                          </span>
                                            </td>
                                        ))}

                                        <td className="py-2 text-right font-bold">
                                            {totalBehaviors}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SessionLogTable;