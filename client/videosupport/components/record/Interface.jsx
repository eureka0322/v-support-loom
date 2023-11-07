import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useStore } from '../../store';

import Logo from '../../../shared/components/Logo';

import VideoRecorder from './VideoRecorder';
import RecordingInterfaceButton from '../../../shared/components/button/RecordingInterfaceButton';
import { Selfie, Settings, FileUpload, Tv } from '../../../shared/icons';
import RecordingInterfaceSettings from './RecordingInterfaceSettings';
import Prompt from '../../../shared/components/Prompt';
import QrPrompt from '../../../shared/components/QrPrompt';

const Interface = ({
  recordingId,
  isRecording,
  handleIsRecording,
  handleUploadOrVideo,
  setUploadPercentage,
  setIsUploading,
  setSlideUpVisibility,
  isSlideUpVisible,
  handWritingSide,
  setHandWritingSide,
  audioRecording,
  setAudioRecording,
  videoRecording,
  setVideoRecording,
}) => {
  const store = useStore();
  const [hasDevicePermission, setDevicePermission] = useState(true);
  const [dismissCameraPrompt, setDismissCameraPrompt] = useState(false);
  const [dismissPrompt, setDismissPrompt] = useState(true);

  const changeFacing = () => {
    store.changeDeviceMode();
  };

  const includeScreenCapture = () => {
    console.log('[includeScreenCapture]');
    store.setRecordingDesktop(true);
  };

  const readFile = (file) => {
    if (file.type && file.type.indexOf('video') === -1) {
      toast.error('File not supported');
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.addEventListener('error', () => {
      setIsUploading(false);
      toast.error('Upload failed');
    });

    reader.addEventListener('progress', (event) => {
      if (event.loaded && event.total) {
        const percent = (event.loaded / event.total) * 100;
        setIsUploading(true);
        setUploadPercentage(percent);
      }
    });

    reader.addEventListener('load', () => {
      store.setStreamingUpload(false);
      handleUploadOrVideo(file, { type: 'upload' });
    });
  };

  const handleFileChange = (e) => {
    console.log('[handleFileChange]');
    const upload = e.target.files[0];
    readFile(upload);
  };

  const handleSettingsMenu = (value) => {
    setSlideUpVisibility(value);
  };
  const [isRecordingAudio, setIsRecordingAudio] = useState(true);

  
  const handleRecordVideoToggle = () => {
    setIsRecordingVideo(!isRecordingVideo);
  };
  const handleRecordAudioToggle = () => {
    setIsRecordingAudio(!isRecordingAudio);
  };

  const [isRecordingVideo, setIsRecordingVideo] = useState(true);

  const suggestChromeBrowser = () => {
    if (
      store.state.device.platform.type === 'desktop' &&
      store.state.device.browser.name === 'Firefox'
    ) {
      return true;
    } else if (
      store.state.device.platform.type === 'mobile' &&
      (store.state.device.browser.name === 'Firefox' ||
        store.state.device.browser.name === 'Opera')
    ) {
      return true;
    } else {
      return false;
    }

    // firefox doesn't allow sound recording on both desktop & mobile
    // opera mobile is not supported
  };

  useEffect(() => {
    if (!store.state.device.isAvailable) {
      setDevicePermission(false);
    }
  }, [store.state.device.isAvailable]);

  useEffect(() => {
    if (dismissCameraPrompt) {
      setIsRecordingVideo(false);
      setIsRecordingAudio(false);
    }
  }, [dismissCameraPrompt]);

  return (
    <React.Fragment>
      <VideoRecorder
        recordingId={recordingId}
        isRecording={isRecording}
        handleIsRecording={handleIsRecording}
        handleUploadOrVideo={handleUploadOrVideo}
        handWritingSide={handWritingSide}
        audioRecording={isRecordingAudio}
        videoRecording={isRecordingVideo}
        dismissCameraPrompt={dismissCameraPrompt}
      />
      {(!hasDevicePermission && !dismissCameraPrompt ) &&  (
        <Prompt
          title={'Permission denied'}
          text="Allow camera and microphone permission to proceed"
          explanationHeadline={'How to fix'}
          explanation={
            'Tap the lock icon (🔒) in the address bar, allow the audio and video permissions. Or dismiss to capture only your screen.'
          }
          action={function(){setDismissCameraPrompt(true);}}
          actionLabel={'Dismiss'}
        />
      )}

      {!isRecording &&  (
        <div className="rnw jcsb vsio-ui-container vsio-ui-top">
          <RecordingInterfaceButton onClick={() => { }} />
          <RecordingInterfaceButton
            icon={<Settings />}
            onClick={() => handleSettingsMenu(true)}
            label="Settings"
          />
        </div>
      )}
      {suggestChromeBrowser() && hasDevicePermission && (
        <Prompt
          title={'Browser not supported'}
          text={'We suggest using chrome instead'}
          action="https://www.google.com/chrome/"
          actionLabel={'Go to chrome'}
        />
      )}
      {store.state.device.platform.type === 'desktop' && (
        <QrPrompt title={'Scan QR'} text={'Record a video on your phone'} />
      )}
      {!isRecording && (
        <div className="rnw jcsb vsio-ui-container vsio-ui-bottom">
          <form className="form form-upload" encType="multipart/form-data">
            <label
              className="dpf cnw aic fileupload-label"
              htmlFor="file-upload"
            >
              <div className="icon">
                <FileUpload />
              </div>
              <p className={`fileupload-text fileupload-text-with-icon`}>
                Upload
              </p>
            </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload" 
              accept="video/*, video/mp4, video/x-m4v, video/mpeg, video/ogg, video/webm"
              className="fileupload-input"
              onChange={(e) => handleFileChange(e)}
            />
          </form>
          {store.state.device.platform.type !== 'desktop' && (
            <RecordingInterfaceButton
              icon={<Selfie />}
              onClick={changeFacing}
              label="Switch"
            />
          )
          }
          {store.state.device.platform.type === 'desktop' && (
          <RecordingInterfaceButton
            icon={<Tv />}
            onClick={includeScreenCapture}
            label="Screen Capture"
          />
          )
          }
        </div>
      )}
      <div className="dpf logo-display">
        <Logo version="light" />
      </div>
      {isSlideUpVisible && (
        <RecordingInterfaceSettings
          headline="Settings"
          handleSettingsMenu={handleSettingsMenu}
          handWritingSide={handWritingSide}
          setHandWritingSide={setHandWritingSide}
          handleRecordAudioToggle={handleRecordAudioToggle}
          handleRecordVideoToggle={handleRecordVideoToggle}
          isRecordingAudio={isRecordingAudio}
          isRecordingVideo={isRecordingVideo}
          isOnDesktop={store.state.device.platform.type === 'desktop'}
        />
      )}
      <style jsx>{`
        .logo-display {
          position: absolute;
          top: 48px;
        }
        .form-upload {
          border-radius: 3px;
          pointer-events: all;
          cursor: pointer;
        }
        .form-upload:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .fileupload-text {
          color: var(--white);
          font-size: var(--fs-sm);
          font-weight: 500;
        }

        .fileupload-text-with-icon {
          margin-top: 4px;
        }
        .fileupload-label {
          width: 100%;
          height: 100%;
          cursor: inherit;
          padding: 12px;
        }
        .fileupload-input {
          display: none;
        }
      `}</style>
    </React.Fragment>
  );
};

export default Interface;
