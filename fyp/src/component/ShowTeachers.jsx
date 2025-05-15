import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TeacherSummary() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("token"); // Adjust key if needed

        fetch("/teacher-summary", {
            headers: {
                "Authorization": `Bearer ${token}`,  // Add token here
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setTeachers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch teachers", err);
                setLoading(false);
            });
    }, []);
    if (loading) {
        return <div className="text-center p-6">Loading...</div>;
    }

    if (!teachers.length) {
        return <div className="text-center p-6">No teachers found.</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Teacher Summary</h1>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Number of Classes</th>
                        <th>Number of Students</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teachers.map((teacher) => (
                        <tr key={teacher.teacher_id}>
                            <td>{teacher.full_name}</td>
                            <td>{teacher.number_of_classes}</td>
                            <td>{teacher.number_of_students}</td>
                            <td>
                                <Link
                                    to={`/admin/teachers/${teacher.teacher_id}`}
                                    className="btn btn-sm btn-primary"
                                >
                                    View Classes
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
