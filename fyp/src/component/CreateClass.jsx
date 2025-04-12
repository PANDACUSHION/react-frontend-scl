import React, { useState } from 'react';
import axios from 'axios';

const CreateClass = () => {
    const [className, setClassName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!className || !image) {
            setMessage('Class name and image are required.');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('class_name', className);
        formData.append('description', description);
        formData.append('image', image);

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('/api/teacher/create-class', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                setMessage('Class created successfully!');
                setClassName('');
                setDescription('');
                setImage(null);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-10">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center mb-4">Create New Class</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Class Name</span>
                            </label>
                            <input
                                type="text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                placeholder="Enter class name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description (Optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter class description"
                                className="textarea textarea-bordered w-full h-24"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Class Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="file-input file-input-bordered w-full"
                                accept="image/*"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} shadow-lg`}>
                                <div>
                                    <span>{message}</span>
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-center mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Creating Class' : 'Create Class'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateClass;