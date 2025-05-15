import React, { useEffect, useState } from 'react';
import {
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaUsers,
    FaChartBar,
    FaChartLine,
} from 'react-icons/fa';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
    LineChart,
    Line,
    Legend,
    PieChart,
    Pie,
} from 'recharts';

const BEHAVIOR_COLORS = {
    'hand-raising': '#4f46e5',
    reading: '#10b981',
    writing: '#f59e0b',
};

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/dashboard/page/stats', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatBehaviorName = (name) =>
        name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

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

    if (!dashboardData) return null;

    return (
        <div className="container mx-auto px-2 py-4 pt-10">
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {/* Classes */}
                <MetricCard
                    icon={<FaChalkboardTeacher size={16} />}
                    label="Classes"
                    value={dashboardData.core_metrics.total_classes}
                    bg="bg-blue-50"
                    text="text-blue-600"
                />

                {/* Sessions */}
                <MetricCard
                    icon={<FaCalendarAlt size={16} />}
                    label="Sessions"
                    value={dashboardData.core_metrics.total_sessions}
                    bg="bg-green-50"
                    text="text-green-600"
                />

                {/* Most Active */}
                <MetricCard
                    icon={<FaUsers size={16} />}
                    label="Most Active"
                    value={
                        dashboardData.class_performance.length > 0
                            ? dashboardData.class_performance[0].class_name.substring(0, 8)
                            : 'N/A'
                    }
                    bg="bg-yellow-50"
                    text="text-yellow-600"
                />

                {/* Total Behaviors */}
                <MetricCard
                    icon={<FaChartBar size={16} />}
                    label="Total Behaviors"
                    value={dashboardData.behavior_summary.reduce(
                        (sum, item) => sum + item.count,
                        0
                    )}
                    bg="bg-purple-50"
                    text="text-purple-600"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Behavior Distribution */}
                <ChartCard title="Behavior Distribution" icon={<FaChartBar size={14} />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dashboardData.behavior_summary}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="behavior"
                                fontSize={12}
                                tickFormatter={formatBehaviorName}
                            />
                            <YAxis fontSize={12} />
                            <Tooltip
                                formatter={(value, name, props) => [
                                    value,
                                    formatBehaviorName(props.payload.behavior),
                                ]}
                            />
                            <Bar dataKey="count" name="Count">
                                {dashboardData.behavior_summary.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            BEHAVIOR_COLORS[entry.behavior] ||
                                            COLORS[index % COLORS.length]
                                        }
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Weekly Trends */}
                <ChartCard title="Weekly Trends" icon={<FaChartLine size={14} />}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={dashboardData.weekly_trends}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="week" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Legend />
                            {['hand-raising', 'reading', 'writing'].map((behavior, index) => (
                                <Line
                                    key={behavior}
                                    type="monotone"
                                    dataKey={`behaviors[${index}].count`}
                                    name={formatBehaviorName(behavior)}
                                    stroke={
                                        BEHAVIOR_COLORS[behavior] ||
                                        COLORS[index % COLORS.length]
                                    }
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Class Performance Table */}
            <div className="bg-base-100 shadow-sm p-3 rounded mb-4">
                <h2 className="text-sm font-medium flex items-center mb-2">
                    <FaChalkboardTeacher className="mr-1" size={14} /> Class Performance
                </h2>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full text-sm">
                        <thead>
                        <tr>
                            <th className="text-xs">Class</th>
                            <th className="text-xs text-center">Sessions</th>
                            <th className="text-xs text-center">Hand Raising</th>
                            <th className="text-xs text-center">Reading</th>
                            <th className="text-xs text-center">Writing</th>
                            <th className="text-xs text-center">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboardData.class_performance.map((classData) => (
                            <tr key={classData.class_id} className="border-b border-gray-100">
                                <td className="py-1">{classData.class_name}</td>
                                <td className="py-1 text-center">{classData.session_count}</td>
                                {classData.behaviors.map((b, idx) => (
                                    <td className="py-1 text-center" key={idx}>
                      <span style={{ color: BEHAVIOR_COLORS[b.behavior] }}>
                        {b.count}
                      </span>
                                    </td>
                                ))}
                                <td className="py-1 text-center font-medium">
                                    {classData.behaviors.reduce((sum, b) => sum + b.count, 0)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Behavior Distribution Pie */}
            <ChartCard title="Overall Behavior Distribution" icon={<FaChartBar size={14} />}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={dashboardData.behavior_summary}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            labelLine={false}
                            dataKey="count"
                            nameKey="behavior"
                            label={({ behavior, percent }) =>
                                `${formatBehaviorName(behavior)}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {dashboardData.behavior_summary.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        BEHAVIOR_COLORS[entry.behavior] ||
                                        COLORS[index % COLORS.length]
                                    }
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [value, formatBehaviorName(name)]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};

// 📦 Reusable Metric Card
const MetricCard = ({ icon, label, value, bg, text }) => (
    <div className="bg-base-100 shadow-sm p-3 rounded">
        <div className="flex items-center">
            <div className={`p-2 rounded-full ${bg} ${text} mr-2`}>{icon}</div>
            <div>
                <h2 className="text-sm font-medium">{label}</h2>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    </div>
);

// 📦 Reusable Chart Wrapper
const ChartCard = ({ title, icon, children }) => (
    <div className="bg-base-100 shadow-sm p-3 rounded h-72">
        <h2 className="text-sm font-medium flex items-center mb-2">
            {icon} <span className="ml-1">{title}</span>
        </h2>
        {children}
    </div>
);

export default Dashboard;
