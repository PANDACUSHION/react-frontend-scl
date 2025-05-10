import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideoFileProcessor = () => {
  const navigate = useNavigate(); // Define the navigate function
  const { session_id } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [processingStage, setProcessingStage] = useState('idle');
  const [frameRate, setFrameRate] = useState(1);
  const [maxDuration, setMaxDuration] = useState(60);
  const [videoReady, setVideoReady] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [abortController, setAbortController] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Clean up resources
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const cleanupResources = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    if (abortController) {
      abortController.abort();
    }
  };

  // Handle video metadata
  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;
    
    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setVideoReady(true);
      setTotalFrames(Math.floor(video.duration * frameRate));
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl, frameRate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Clean up previous resources before setting new ones
    cleanupResources();
    
    if (file.size > 200 * 1024 * 1024) {
      setError("File size exceeds 200MB limit");
      return;
    }
    
    // Create a new secure object URL
    const newVideoUrl = URL.createObjectURL(file);
    
    setSelectedFile(file);
    setVideoUrl(newVideoUrl);
    setError(null);
    setResults([]);
    setProcessingStage('selected');
    setVideoReady(false);
    setCurrentFrame(0);
    setTotalFrames(0);
    setShowResults(false);
  };

  const processFrames = async () => {
    if (!videoRef.current || !selectedFile || !videoReady) {
      setError("Video not loaded properly");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Create a new abort controller and save it
    const controller = new AbortController();
    setAbortController(controller);

    try {
      setIsProcessing(true);
      setProcessingStage('processing');
      setProcessingProgress(0);
      setResults([]);
      setShowResults(false);

      if (video.duration > maxDuration) {
        throw new Error(`Video exceeds ${maxDuration} second limit`);
      }

      const duration = video.duration;
      const totalFramesToProcess = Math.floor(duration * frameRate);
      setTotalFrames(totalFramesToProcess);
      const frameInterval = 1 / frameRate;
      const results = [];

      for (let i = 0; i < duration; i += frameInterval) {
        if (controller.signal.aborted) break;

        video.currentTime = i;
        
        await new Promise((resolve) => {
          const onSeeked = () => {
            video.removeEventListener('seeked', onSeeked);
            resolve();
          };
          video.addEventListener('seeked', onSeeked);
        });

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Use lower quality for better performance and security
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        try {
          const response = await sendFrameForDetection(imageData, controller.signal);
          if (response.data) {
            results.push({
              timestamp: i,
              detections: response.data.detections || [],
              frame: imageData
            });
          }
        } catch (err) {
          if (axios.isCancel(err)) break;
          console.error(`Error processing frame at ${i}s:`, err);
          results.push({
            timestamp: i,
            detections: [],
            frame: imageData
          });
        }

        const currentFrameNumber = Math.floor(i * frameRate) + 1;
        const progress = Math.floor((currentFrameNumber / totalFramesToProcess) * 100);
        setProcessingProgress(Math.min(100, progress));
        setCurrentFrame(currentFrameNumber);
      }

      setResults(results);
      setProcessingStage('completed');
      setAbortController(null);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.message);
        setProcessingStage('failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sendFrameForDetection = async (imageData, signal) => {
    // Convert data URL to blob securely
    const response = await fetch(imageData);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('image', blob);

    return axios.post(
      `/api/session/detect/${session_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        signal
      }
    );
  };

  const cancelProcessing = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsProcessing(false);
    setProcessingStage('cancelled');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetProcessor = () => {
    cleanupResources();
    setSelectedFile(null);
    setVideoUrl(null);
    setProcessingStage('idle');
    setResults([]);
    setShowResults(false);
  };

  const toggleResults = () => {
    navigate(`/session/${session_id}`); // Fixed to use a better path pattern
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-base-200 rounded-box shadow-lg pt-10">
      <h1 className="text-3xl font-bold text-center mb-4">Video Frame Analysis</h1>
      <p className="text-center mb-6 text-gray-500">Session ID: {session_id}</p>

      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button className="btn btn-sm btn-ghost" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <ul className="steps steps-horizontal w-full mb-8">
        <li className={`step ${processingStage !== 'idle' ? 'step-primary' : ''}`}>Select Video</li>
        <li className={`step ${processingStage === 'processing' || processingStage === 'completed' ? 'step-primary' : ''}`}>Process Frames</li>
        <li className={`step ${processingStage === 'completed' ? 'step-primary' : ''}`}>View Results</li>
      </ul>

      {processingStage === 'idle' && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body items-center text-center">
            <h2 className="card-title mb-4">Upload a Video for Frame Analysis</h2>
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">MP4, MOV, or AVI (MAX 200MB, {maxDuration}s)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </label>
              
              <div className="mt-4 w-full max-w-md">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Processing Frame Rate</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={frameRate}
                    onChange={(e) => setFrameRate(Number(e.target.value))}
                  >
                    <option value={0.5}>0.5 FPS (every 2 seconds)</option>
                    <option value={1}>1 FPS (every second)</option>
                    <option value={2}>2 FPS (every 0.5 seconds)</option>
                    <option value={5}>5 FPS (every 0.2 seconds)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {processingStage === 'selected' && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Video Preview</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-contain"
                    src={videoUrl}
                    controls
                    onLoadedMetadata={() => setVideoReady(true)}
                  />
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div>
                <div className="bg-base-200 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Processing Settings</h3>
                  
                  <div className="stats stats-vertical shadow w-full mb-4">
                    <div className="stat">
                      <div className="stat-title">Selected Frame Rate</div>
                      <div className="stat-value text-lg">{frameRate} FPS</div>
                    </div>
                    
                    <div className="stat">
                      <div className="stat-title">Estimated Frames</div>
                      <div className="stat-value text-lg">
                        {videoReady ? Math.floor(videoDuration * frameRate) : '...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      className={`btn btn-primary w-full ${!videoReady ? 'btn-disabled' : ''}`}
                      onClick={processFrames}
                      disabled={!videoReady}
                    >
                      {videoReady ? 'Start Frame Analysis' : 'Loading Video...'}
                    </button>
                    
                    <button
                      className="btn btn-outline mt-2 w-full"
                      onClick={resetProcessor}
                    >
                      Choose Different Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {processingStage === 'processing' && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body items-center text-center">
            <h2 className="card-title mb-6">Processing Video Frames</h2>
            
            <div className="w-full max-w-md">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Processing Progress</span>
                <span className="text-sm font-medium">
                  {currentFrame} / {totalFrames} frames ({processingProgress}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-accent h-4 rounded-full transition-all duration-300" 
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-center mt-6">
                <span className="loading loading-spinner loading-lg text-accent"></span>
              </div>
              
              <button 
                className="btn btn-error mt-4"
                onClick={cancelProcessing}
              >
                Cancel Processing
              </button>
            </div>
          </div>
        </div>
      )}

      {processingStage === 'completed' && !showResults && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body items-center text-center">
            <h2 className="card-title mb-4">Processing Complete!</h2>
            
            <div className="stats shadow mb-6">
              <div className="stat">
                <div className="stat-title">Total Frames Processed</div>
                <div className="stat-value">{results.length}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Detections Found</div>
                <div className="stat-value">
                  {results.reduce((count, r) => count + (r.detections?.length || 0), 0)}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={toggleResults}
              >
                See Results
              </button>
              
              <button
                className="btn btn-outline"
                onClick={resetProcessor}
              >
                Analyze Another Video
              </button>
            </div>
          </div>
        </div>
      )}

      {processingStage === 'completed' && showResults && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Frame Analysis Results</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-contain"
                    src={videoUrl}
                    controls
                  />
                </div>
                
                <div className="stats shadow w-full mt-4">
                  <div className="stat">
                    <div className="stat-title">Total Frames Processed</div>
                    <div className="stat-value">{results.length}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Detections Found</div>
                    <div className="stat-value">
                      {results.reduce((count, r) => count + (r.detections?.length || 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-base-200 p-4 rounded-lg h-full">
                  <h3 className="font-bold text-lg mb-2">Detection Timeline</h3>
                  
                  {results.some(r => r.detections?.length > 0) ? (
                    <div className="overflow-y-auto max-h-96">
                      {results.filter(r => r.detections?.length > 0).map((result, index) => (
                        <div 
                          key={index}
                          className="collapse collapse-plus bg-base-100 mb-2"
                        >
                          <input type="checkbox" />
                          <div className="collapse-title font-medium">
                            {formatTime(result.timestamp)} - {result.detections.length} detection(s)
                          </div>
                          <div className="collapse-content">
                            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-800 mb-2">
                              <img
                                src={result.frame}
                                alt={`Detection at ${formatTime(result.timestamp)}`}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            
                            <table className="table table-xs">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Confidence</th>
                                </tr>
                              </thead>
                              <tbody>
                                {result.detections.map((detection, i) => (
                                  <tr key={i}>
                                    <td>{detection.class || 'unknown'}</td>
                                    <td>
                                      <div className="flex items-center">
                                        <span className="mr-2">{Math.round(detection.confidence * 100)}%</span>
                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                          <div 
                                            className="bg-success h-2 rounded-full" 
                                            style={{ width: `${detection.confidence * 100}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40">
                      <p className="text-gray-500">No detections found in any frames</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col md:flex-row gap-4">
              <button
                className="btn btn-primary"
                onClick={resetProcessor}
              >
                Analyze Another Video
              </button>
              
              <button
                className="btn btn-outline"
                onClick={() => setShowResults(false)}
              >
                Hide Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFileProcessor;