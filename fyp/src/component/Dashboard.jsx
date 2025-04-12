import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    FaChalkboardTeacher,
    FaUsers,
    FaClock,
    FaClipboardList,
    FaChartBar,
    FaCalendarAlt,
    FaChalkboard
} from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [behaviorSummary, setBehaviorSummary] = useState([]);
    const [recentSessions, setRecentSessions] = useState([]);
    const [topClasses, setTopClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Colors for charts
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No auth token found');
                }

                const headers = {
                    'Authorization': `Bearer ${token}`
                };

                // Fetch all data in parallel with Authorization headers
                const [statsRes, behaviorRes, sessionsRes, classesRes] = await Promise.all([
                    fetch('/api/dashboard/stats', { headers }),
                    fetch('/api/dashboard/behavior-summary', { headers }),
                    fetch('/api/dashboard/recent-sessions', { headers }),
                    fetch('/api/dashboard/top-classes', { headers })
                ]);

                if (!statsRes.ok || !behaviorRes.ok || !sessionsRes.ok || !classesRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const [statsData, behaviorData, sessionsData, classesData] = await Promise.all([
                    statsRes.json(),
                    behaviorRes.json(),
                    sessionsRes.json(),
                    classesRes.json()
                ]);

                setStats(statsData);
                // Convert behavior summary object to array for charts
                setBehaviorSummary(Object.entries(behaviorData).map(([name, value]) => ({ name, value })));
                setRecentSessions(sessionsData);
                setTopClasses(classesData);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };


        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-md"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error max-w-lg mx-auto mt-4 text-sm">
                <span>Error loading dashboard: {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-2 py-4 pt-10">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

            {/* Stats Cards - More compact row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600 mr-2">
                            <FaChalkboardTeacher size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Classes</h2>
                            <p className="text-lg font-bold">{stats?.total_classes || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-50 text-green-600 mr-2">
                            <FaUsers size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Students</h2>
                            <p className="text-lg font-bold">{stats?.total_students || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-yellow-50 text-yellow-600 mr-2">
                            <FaClock size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Active</h2>
                            <p className="text-lg font-bold">{stats?.active_sessions || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-50 text-purple-600 mr-2">
                            <FaClipboardList size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-medium">Behaviors</h2>
                            <p className="text-lg font-bold">{stats?.recent_behaviors || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Behavior Summary Chart */}
                <div className="bg-base-100 shadow-sm p-3 rounded lg:col-span-2">
                    <h2 className="text-sm font-medium flex items-center mb-2">
                        <FaChartBar className="mr-1" size={14} /> Behavior Summary
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={behaviorSummary}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Behavior Distribution Pie Chart */}
                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <h2 className="text-sm font-medium flex items-center mb-2">
                        <FaChartBar className="mr-1" size={14} /> Behavior Distribution
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={behaviorSummary}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {behaviorSummary.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Sessions and Top Classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Sessions */}
                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <h2 className="text-sm font-medium flex items-center mb-2">
                        <FaCalendarAlt className="mr-1" size={14} /> Recent Sessions
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full text-sm">
                            <thead>
                            <tr>
                                <th className="text-xs">Class</th>
                                <th className="text-xs">Time</th>
                                <th className="text-xs text-right">Behaviors</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentSessions.map((session, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-1">{session.class_name}</td>
                                    <td className="py-1 text-xs">{new Date(session.start_time).toLocaleString()}</td>
                                    <td className="py-1 text-right">
                                        <span className="badge badge-sm">{session.behavior_count}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Classes */}
                <div className="bg-base-100 shadow-sm p-3 rounded">
                    <h2 className="text-sm font-medium flex items-center mb-2">
                        <FaChalkboard className="mr-1" size={14} /> Most Active Classes
                    </h2>
                    <div className="space-y-2">
                        {topClasses.map((cls, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <div className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-sm">{cls.class_name}</h3>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full"
                                            style={{ width: `${(cls.session_count / (topClasses[0]?.session_count || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className="ml-2 text-xs">{cls.session_count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;