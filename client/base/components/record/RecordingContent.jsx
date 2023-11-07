import React, { useEffect, useRef } from 'react';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import toast from 'react-hot-toast';

import RecordingModal from './RecordingModal';

const RecordingContent = () => {
  const previewRef = useRef(null);

  const setupPreview = () => {
    const options = {
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
      audio: false,
    };

    navigator.mediaDevices
      .getUserMedia(options)
      .then((videoStream) => {
        const videoElement = previewRef.current;
        if (videoElement) {
          videoElement.srcObject = videoStream;
        }

        new RecordRTC(videoStream, {
          type: 'video',
          disableLogs: true,
          video: videoElement,
          recorderType: MediaStreamRecorder,
          mimeType: 'video/webm;codecs=h264',
          timeSlice: 1000,
        });
      })
      .catch((err) => {
        /* Camera Permission Denied */
        console.error('[setupCamera]', err);
        toast.error('Camera unavailable');
        store.setDeviceAvailability(false);
        return;
      });
  };

  useEffect(() => {
    setupPreview();
  }, []);

  return (
    <section className="record-content">
      <div className="record-content-mask">
        <video
          ref={previewRef}
          autoPlay
          playsInline
          loop
          muted
          className="preview"
        />
        <div className="record-content-modal">
          <RecordingModal
            headline={'Record video'}
            description={'Show & share with everybody, anywhere'}
          />
        </div>
      </div>
      <style jsx>{`
        .record-content {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 24px;
        }
        .record-content-mask {
          overflow: hidden;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }

        .record-content-modal {
          background: var(--white);
          box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25);
          border-radius: 5px;
          padding: 56px 64px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .preview {
          width: 100%;
          height: 100%;
          transform: scale(2);
          transform-origin: center center;
          background: var(--primary);
        }

        @media only screen and (max-width: 675px) {
          .record-content-modal {
            width: 100%;
            max-width: 75%;
            padding: 24px 32px;
          }
        }
      `}</style>
    </section>
  );
};

export default RecordingContent;
