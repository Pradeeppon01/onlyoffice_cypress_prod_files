import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture, id, disabled }) => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [file, setFile] = useState([]);
  const [filename, setFilename] = useState([]);
  const [facingMode, setFacingMode] = useState('user');

  const webcamRef = useRef(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImages((prevImages) => [...prevImages, imageSrc]);
    const newFile = dataURLtoFile(imageSrc, id + Date.now() + '_' + 'captured_photo.png');
    setFile((prev) => [...prev, newFile]);
    setFilename((prev) => [...prev, id + Date.now() + 'captured_photo.png']);
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const SubmitAll = () => {
    onCapture(file, filename);
    setCapturedImages([]);
    setFile([]);
    setFilename([]);
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const videoConstraints = {
    facingMode: facingMode === 'user' ? 'user' : { exact: 'environment' },
  };

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      <Webcam height="160px" audio={false} ref={webcamRef} videoConstraints={videoConstraints} />
      <div>
        <div style={{ position: "absolute" }}>
          {capturedImages.length > 0 && (
            <div
              style={{ width: '200px', height: '160px', border: '2px solid black', display: 'flex', flexWrap: 'wrap' }}
            >
              {capturedImages.map((imageSrc, index) => (
                <img height="50px" key={index} src={imageSrc} alt={`Captured ${index}`} />
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'absolute', top: '105px', left: '85px', fontSize: "40px", color: "white" }}>
          <i id="capturephoto" onClick={capturePhoto} className="ri-camera-fill"></i>
        </div>
        <div style={{ position: 'absolute', top: '2px', right: '310px', color: "white" }}>
          <i id="switchcamera" onClick={switchCamera} className="ri-camera-switch-line"></i>
        </div>

        <button
          id="submit"
          className="btn btn-primary"
          style={{ width: '400px', marginLeft: '-230px', marginTop: '170px' }}
          onClick={SubmitAll}
          disabled={disabled}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default WebcamCapture;
