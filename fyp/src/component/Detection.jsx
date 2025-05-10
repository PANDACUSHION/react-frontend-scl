import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ClassroomDetection = () => {
    const { session_id } = useParams(); // Get session_id from URL
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detections, setDetections] = useState([]);
    const [visualizationImage, setVisualizationImage] = useState(null);
    const [error, setError] = useState(null);
    const [streamActive, setStreamActive] = useState(false);
    const [isCameraPermissionDenied, setCameraPermissionDenied] = useState(false);
    const [captureInterval, setCaptureInterval] = useState(null);
    const [captureFrequency, setCaptureFrequency] = useState(1); // seconds
    const [processingTime, setProcessingTime] = useState(0);
    const [detectionCount, setDetectionCount] = useState(0);

    // Initialize webcam
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            setError(null);
            const constraints = {
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 640 },
                    facingMode: "user"
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
                setCameraPermissionDenied(false);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError(`Camera access error: ${err.message}`);
            setCameraPermissionDenied(true);
            setStreamActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreamActive(false);
        }

        if (captureInterval) {
            clearInterval(captureInterval);
            setCaptureInterval(null);
        }
    };

    const captureImage = () => {
        if (!videoRef.current || !streamActive) {
            setError("Video stream not available");
            return null;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas dimensions to 640x640
        canvas.width = 640;
        canvas.height = 640;

        // Calculate centering if video has different aspect ratio
        const video = videoRef.current;
        let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

        if (video.videoWidth > video.videoHeight) {
            // Landscape: crop sides
            sx = (video.videoWidth - video.videoHeight) / 2;
            sWidth = video.videoHeight;
        } else if (video.videoHeight > video.videoWidth) {
            // Portrait: crop top/bottom
            sy = (video.videoHeight - video.videoWidth) / 2;
            sHeight = video.videoWidth;
        }

        // Draw the image centered and cropped to square
        context.drawImage(
            video,
            sx, sy, sWidth, sHeight,
            0, 0, canvas.width, canvas.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const sendImageForDetection = async () => {
        try {
            const imageDataUrl = captureImage();
            if (!imageDataUrl) return;

            // Convert base64 to blob
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('image', blob, 'capture.jpg');

            setIsDetecting(true);
            const token = localStorage.getItem('token');

            const startTime = Date.now();
            const result = await axios.post(
                `/api/session/detect/${session_id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (result.data && result.data.success) {
                setDetections(result.data.detections || []);
                setVisualizationImage("http://127.0.0.1:7000"+result.data.visualization);
                setProcessingTime(result.data.processing_time);
                setDetectionCount(result.data.detection_count || 0);
            } else {
                setError("Detection failed: " + (result.data?.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Error sending image for detection:", err);
            setError(`Detection error: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsDetecting(false);
        }
    };

    const toggleContinuousDetection = () => {
        if (captureInterval) {
            // Stop continuous detection
            clearInterval(captureInterval);
            setCaptureInterval(null);
        } else if (streamActive) {
            // Start continuous detection
            const interval = setInterval(() => {
                sendImageForDetection();
            }, captureFrequency * 1000);
            setCaptureInterval(interval);
        }
    };

    const handleFrequencyChange = (e) => {
        const newFrequency = parseFloat(e.target.value);
        setCaptureFrequency(newFrequency);

        // Update interval if already running
        if (captureInterval) {
            clearInterval(captureInterval);
            const interval = setInterval(() => {
                sendImageForDetection();
            }, newFrequency * 1000);
            setCaptureInterval(interval);
        }
    };

    // Calculate behavior counts for statistics
    const behaviorCounts = {};
    detections.forEach(detection => {
        const behavior = detection.class || 'unknown';
        behaviorCounts[behavior] = (behaviorCounts[behavior] || 0) + 1;
    });

    return (
        <div className="w-full max-w-7xl mx-auto p-4 bg-base-200 rounded-box shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Classroom Behavior Detection</h1>
            <p className="text-center mb-6">Session ID: {session_id}</p>

            {error && (
                <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Camera Feed Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Camera Feed</h2>

                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-800">
                            {isCameraPermissionDenied ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                                    <div className="text-center p-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p className="mt-2">Camera access denied</p>
                                        <button className="btn btn-primary mt-4" onClick={startCamera}>
                                            Retry Camera Access
                                        </button>
                                    </div>
                                </div>
                            ) : !streamActive ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                                    <div className="text-center">
                                        <div className="loading loading-spinner loading-lg mb-4"></div>
                                        <p>Initializing camera...</p>
                                    </div>
                                </div>
                            ) : null}
                            <video
                                ref={videoRef}
                                className="h-full w-full object-cover"
                                autoPlay
                                playsInline
                                muted
                            />
                            <canvas
                                ref={canvasRef}
                                className="hidden"
                            />
                        </div>

                        <div className="card-actions justify-between mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={sendImageForDetection}
                                disabled={!streamActive || isDetecting}
                            >
                                {isDetecting ?
                                    <span className="loading loading-spinner loading-sm mr-2"></span> :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                }
                                {isDetecting ? "Detecting..." : "Capture & Detect"}
                            </button>

                            <button
                                className={`btn ${captureInterval ? 'btn-error' : 'btn-success'}`}
                                onClick={toggleContinuousDetection}
                                disabled={!streamActive}
                            >
                                {captureInterval ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                        </svg>
                                        Stop
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        Start Continuous
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="form-control mt-2">
                            <label className="label">
                                <span className="label-text">Capture Frequency (seconds)</span>
                                <span className="label-text-alt">{captureFrequency}s</span>
                            </label>
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.5"
                                value={captureFrequency}
                                onChange={handleFrequencyChange}
                                className="range range-primary range-sm"
                            />
                            <div className="w-full flex justify-between text-xs px-2">
                                <span>0.5s</span>
                                <span>1s</span>
                                <span>1.5s</span>
                                <span>2s</span>
                                <span>2.5s</span>
                                <span>3s</span>
                                <span>3.5s</span>
                                <span>4s</span>
                                <span>4.5s</span>
                                <span>5s</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Detection Results</h2>

                        {visualizationImage ? (
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-800">
                                <img
                                    src={visualizationImage}
                                    alt="Detection Visualization"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-800 flex items-center justify-center">
                                <p className="text-gray-400">No detection results yet</p>
                            </div>
                        )}

                        <div className="mt-4">
                            <div className="stats shadow w-full mb-4">
                                <div className="stat">
                                    <div className="stat-title">Processing Time</div>
                                    <div className="stat-value">{processingTime}s</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Total Detections</div>
                                    <div className="stat-value">{detectionCount}</div>
                                </div>
                            </div>

                            <h3 className="font-semibold text-lg">Behavior Summary</h3>

                            {Object.keys(behaviorCounts).length > 0 ? (
                                <div className="stats stats-vertical lg:stats-horizontal shadow w-full mt-2">
                                    {Object.entries(behaviorCounts).map(([behavior, count]) => (
                                        <div className="stat" key={behavior}>
                                            <div className="stat-title">{behavior}</div>
                                            <div className="stat-value">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 mt-2">
                                    No behaviors detected yet
                                </div>
                            )}

                            <div className="divider"></div>

                            <h3 className="font-semibold text-lg">Detailed Detections</h3>

                            <div className="overflow-x-auto mt-2">
                                {detections.length > 0 ? (
                                    <table className="table table-zebra table-xs">
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Class</th>
                                            <th>Confidence</th>
                                            <th>Position</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {detections.map((detection, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{detection.class || 'unknown'}</td>
                                                <td>{(detection.confidence || 0).toFixed(2)}</td>
                                                <td className="font-mono text-xs">
                                                    [{detection.bbox ? detection.bbox.map(v => Math.round(v)).join(', ') : 'N/A'}]
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="text-sm text-gray-500">
                                        No detection data available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomDetection;