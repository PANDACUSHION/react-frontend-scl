import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DetectionViewer = () => {
    const { session_id } = useParams(); // Extract session ID from the URL
    const [image, setImage] = useState(null);
    const [detection, setDetection] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!image) {
            setError('Please upload an image');
            return;
        }

        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage

            const response = await axios.post(
                `/api/session/detect/${session_id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`, // Add the Authorization header
                    },
                }
            );

            if (response.data.analysis) {
                setDetection(response.data.analysis);
            } else {
                setError('No behavior detected.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">Upload Image for Behavior Detection</h1>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border p-2 w-full rounded"
            />
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Detecting...' : 'Submit'}
            </button>

            {error && <div className="text-red-500">{error}</div>}

            {detection && (
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h2 className="text-lg font-semibold mb-2">Detection Result</h2>
                    <p><strong>Behavior:</strong> {detection.behaviour}</p>
                    <p><strong>X Axis:</strong> {detection.x_axis}</p>
                    <p><strong>Y Axis:</strong> {detection.y_axis}</p>
                    <p><strong>Width:</strong> {detection.w_axis}</p>
                    <p><strong>Height:</strong> {detection.h_axis}</p>
                    <img
                        src={` http://127.0.0.1:3000/`+detection.image}
                        alt="Detected"
                        className="mt-2 rounded shadow max-h-64"
                    />
                </div>
            )}
        </div>
    );
};

export default DetectionViewer;
