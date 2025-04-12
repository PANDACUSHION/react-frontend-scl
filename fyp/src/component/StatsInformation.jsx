import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatsInformation = () => {
    const { sessionid } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessionStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch(`/api/session/stats/session/${sessionid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized - Please login again');
                }

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setStats(data.message);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionStats();
    }, [sessionid]);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading session statistics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
                {error.includes('Unauthorized') && (
                    <a href="/login">Click here to login</a>
                )}
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="no-data-container">
                <p>No data available for this session</p>
            </div>
        );
    }

    const chartData = Object.entries(stats.behaviors).map(([behavior, count]) => ({
        behavior,
        count,
    }));

    return (
        <div className="stats-container">
            <h1>Session Statistics</h1>

            <div className="session-info">
                <p><strong>Session ID:</strong> {stats.session_id}</p>
                <p><strong>Classroom ID:</strong> {stats.class_id}</p>
                <p><strong>Start Time:</strong> {new Date(stats.start_time).toLocaleString()}</p>
            </div>

            <h2>Behavior Distribution</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="behavior" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="behavior-counts">
                <h3>Detailed Counts:</h3>
                <ul>
                    {Object.entries(stats.behaviors).map(([behavior, count]) => (
                        <li key={behavior}>
                            <strong>
                                {behavior.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}:
                            </strong> {count} occurrences
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx>{`
                .stats-container {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .loading-container,
                .error-container,
                .no-data-container {
                    padding: 20px;
                    text-align: center;
                }
                .error-container {
                    color: #d32f2f;
                }
                .no-data-container {
                    color: #ed6c02;
                }
                .session-info {
                    margin-bottom: 20px;
                }
                .chart-container {
                    margin: 20px 0;
                }
                .behavior-counts ul {
                    list-style-type: none;
                    padding: 0;
                }
                .behavior-counts li {
                    margin-bottom: 8px;
                }
                h1, h2, h3 {
                    color: #333;
                    margin: 20px 0 10px;
                }
                h1 {
                    font-size: 24px;
                }
                h2 {
                    font-size: 20px;
                }
                h3 {
                    font-size: 18px;
                }
            `}</style>
        </div>
    );
};

export default StatsInformation;