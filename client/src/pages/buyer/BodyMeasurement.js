import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import Webcam from 'react-webcam';
import './BodyMeasurement.css';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'; // Import Pose Landmarker
import Male from './Giff/Male.png';
import Female from './Giff/Female.png';

const BodyMeasurement = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [measurements, setMeasurements] = useState(null);
  const [userCategory, setUserCategory] = useState('');
  const [guidance, setGuidance] = useState('');
  const [isTakingPictures, setIsTakingPictures] = useState(false);
  const [phase, setPhase] = useState(0); // 0: Selection, 1: Front, 2: Back
  const [currentPictureCount, setCurrentPictureCount] = useState(0);
  const [totalPictures, setTotalPictures] = useState(5); // Initially set for 5 pictures from the front
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const pictureInterval = 1000;
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  useEffect(() => {
    if (phase === 0) {
      window.scrollTo(0, 0); // Scroll to the top
    }
  }, [phase])

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  // Initialize PoseLandmarker
  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
      );
      const poseLandmarkerInstance = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      });

      // Start detecting pose landmarks when the webcam is ready
      if (webcamRef.current) {
        const video = webcamRef.current.video;
        const predictWebcam = async () => {
          const canvasElement = canvasRef.current;
          const canvasCtx = canvasElement.getContext('2d');

          const detect = async () => {
            if (!video.videoWidth || !video.videoHeight) {
              // Ensure the video feed has proper dimensions before continuing
              return requestAnimationFrame(detect);
            }

            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;

            const startTimeMs = performance.now();
            poseLandmarkerInstance.detectForVideo(video, startTimeMs, (result) => {
              canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

              if (result.landmarks) {
                // Draw the pose connectors and landmarks manually
                result.landmarks.forEach((landmarks) => {
                  drawLandmarksAndConnectors(landmarks, canvasCtx, canvasElement.width, canvasElement.height);
                });
              }
            });

            if (isTakingPictures) {
              requestAnimationFrame(detect);
            }
          };

          detect();
        };

        if (webcamRef.current.video.readyState === 4) {
          predictWebcam();
        } else {
          webcamRef.current.video.addEventListener('loadeddata', predictWebcam);
        }
      }
    };

    loadPoseLandmarker();
  }, [isTakingPictures]);

  // Function to draw pose landmarks and connectors manually
  const drawLandmarksAndConnectors = (landmarks, ctx, width, height) => {
    const POSE_CONNECTIONS = [
      // Example connections for body (between landmarks)
      [11, 13], // Left upper arm
      [13, 15], // Left forearm
      [12, 14], // Right upper arm
      [14, 16], // Right forearm
      [11, 12], // Shoulders
      [23, 24], // Hips
      [11, 23], // Left side of body
      [12, 24], // Right side of body
      [23, 25], // Left upper leg
      [25, 27], // Left lower leg
      [24, 26], // Right upper leg
      [26, 28], // Right lower leg
    ];

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.fillStyle = 'red';

    // Draw landmarks
    landmarks.forEach((landmark, i) => {
      const x = landmark.x * width;
      const y = landmark.y * height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw connectors
    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const startLandmark = landmarks[startIdx];
      const endLandmark = landmarks[endIdx];

      if (startLandmark && endLandmark) {
        ctx.beginPath();
        ctx.moveTo(startLandmark.x * width, startLandmark.y * height);
        ctx.lineTo(endLandmark.x * width, endLandmark.y * height);
        ctx.stroke();
      }
    });
  };

  // Start the measurement process after category selection
  const handleCategorySelect = (category) => {
    setUserCategory(category);
    setPhase(1);
    setGuidance('Please position yourself in front of the camera.');
    setShowPopup(true);
    setPopupMessage('Get ready to start the measurement process.');
    setTimeout(() => {
      setShowPopup(false);
      setTimeout(() => {
        startFrontMeasurements();
      }, 5000);
    }, 2000);
  };

  const startFrontMeasurements = () => {
    setPhase(1);
    setGuidance('Please stand still. Pictures will be taken automatically.');
    setShowPopup(true);
    setPopupMessage('Stand still and prepare for front measurements.');
    setTimeout(() => {
      setShowPopup(false);
      setIsTakingPictures(true);
      setTotalPictures(15); // Set total pictures to 15 for front
      setCurrentPictureCount(0);
    }, 3000);
  };

  const startBackMeasurements = () => {
    setPhase(2);
    setGuidance('Please turn around and spread your arms.');
    setShowPopup(true);
    setPopupMessage('Turn around and spread your arms for back measurements.');
    setTimeout(() => {
      setShowPopup(false);
      setIsTakingPictures(true);
      setTotalPictures(5); // Set total pictures to 5 for back
      setCurrentPictureCount(0);
    }, 5000);
  };

  useEffect(() => {
    let pictureCaptureTimer;

    if (isTakingPictures) {
      pictureCaptureTimer = setInterval(() => {
        captureImage();
        setCurrentPictureCount((prevCount) => prevCount + 1);
      }, pictureInterval);
    }

    return () => clearInterval(pictureCaptureTimer);
  }, [isTakingPictures]);

  useEffect(() => {
    if (currentPictureCount >= totalPictures && isTakingPictures) {
      setIsTakingPictures(false);
      if (phase === 1) {
        startBackMeasurements();
      } else if (phase === 2) {
        setGuidance('Picture taking complete.');
        setShowPopup(true);
        setPopupMessage('Measurement process is complete.');
        // Simulate the measurements being available
        setMeasurements({ 
          neck: 39,         
          shoulderWidth: 46, 
          chestBust: 102,     
          waist: 86,          
          sleeveLength: 61,   
          bicep: 33,         
          wrist: 18,         
          shirtLength: 76    
        });
                
      }
    }
  }, [currentPictureCount, isTakingPictures, phase]);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);
    }
  };

  return (
    <div className="measurement-container-super-dooper-complex w-full h- m-3">
      <h2>Body Measurement Tool</h2>

      {showPopup && (
        <div className="popup-super-dooper-complex">
          <div className="popup-content-super-dooper-complex">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}

      {phase === 0 && (
        <div className="category-selection-super-dooper-complex">
          <h3>Are you?</h3>
          <div className="card-container-super-dooper-complex">
            <div className="card-super-dooper-complex" onClick={() => handleCategorySelect('male')}>
              <img src={Male} alt="Male" />
              <p>Male</p>
            </div>
            <div className="card-super-dooper-complex" onClick={() => handleCategorySelect('female')}>
              <img src={Female} alt="Female"/>
              <p>Female</p>
            </div>
         
          </div>
        </div>
      )}

      {(phase === 1 || phase === 2) && (
        <>
          <p>{guidance}</p>
          <div style={{ position: 'relative', width: 640, height: 480 }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              width={640}
              height={480}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              style={{ position: 'absolute', top: 0, left: 0 }}
            />
          </div>

          <div className="captured-images-super-dooper-complex">
            <h3>Front and Back Side</h3>
            <div className="image-grid-super-dooper-complex">
              {capturedImages.map((img, idx) => (
                <div className="image-card-super-dooper-complex" key={idx}>
                  <img src={img} alt={`Captured ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Render action buttons regardless of measurements */}
          <div className="action-buttons-super-dooper-complex">
          <button
  onClick={() => navigate('/buyer/DataMeasurement', { state: { measurements } })}
  className="show-measurements-button-super-dooper-complex"
  style={{
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px 10px', // Adjust padding for a smaller button
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#000')} // Dark black on hover
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333')} // Revert to original color
>
  Submit
</button>

<button
  onClick={() => {
    setCapturedImages([]);
    setMeasurements(null);
    setPhase(0);
    setGuidance('');
  }}
  className="reset-button-super-dooper-complex"
  style={{
    backgroundColor: 'red',
    color: '#fff',
    padding: '5px 10px', 
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b22222')} 
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'red')} 
>
  Retake
</button>

</div>

        </>
      )}
    </div>
  );
};

export default BodyMeasurement;
