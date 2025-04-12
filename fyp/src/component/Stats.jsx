import React, { useState, useEffect } from 'react';
import { useParams ,Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const { classid } = useParams();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`/api/session/stats/classroom/${classid}/sessions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setStats(data.message);
                setError(null);
            } catch (err) {
                setError(err.message);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [classid]);

    // Transform behaviors data for the chart
    const prepareChartData = () => {
        if (!stats || !stats.behaviors) return [];

        return Object.entries(stats.behaviors).map(([name, count]) => ({
            name: name,
            count: count
        }));
    };

    if (loading) return <div className="flex justify-center items-center h-64"><p className="text-xl">Loading statistics...</p></div>;

    if (error) return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">Error: {error}</div>;

    if (!stats) return <div className="p-4">No statistics available</div>;

    const chartData = prepareChartData();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Classroom Sessions Statistics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Sessions</h2>
                    <p className="text-3xl font-bold">{stats.session_count}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Behaviors</h2>
                    <p className="text-3xl font-bold">{stats.total_behaviors}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Class ID</h2>
                    <p className="text-xl font-medium">{stats.class_id}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-xl font-semibold mb-4">Behavior Distribution</h2>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Sessions List</h2>
                {stats.session_ids && stats.session_ids.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left">Session ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.session_ids.map((id, index) => (
                                <tr key={id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="py-2 px-4 border-b border-gray-200">{id}
                                        <Link to={`/session/${id}`} className="btn btn-primary">
                                            See Class
                                        </Link>
                                    </td>

                                </tr>

                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No sessions available</p>
                )}
            </div>
        </div>
    );
};

export default Stats;