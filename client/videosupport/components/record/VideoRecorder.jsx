import React, { useRef, useEffect, useState } from 'react';
import RecordRTC, { MediaStreamRecorder } from 'recordrtc';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Spinner from './Spinner';
import Gradient from '../misc/Gradient';

import { useStore } from '../../store';
import axios from 'axios';
import { baseUrl } from '../../../env.config';
import { useIsMount } from '../../../shared/hooks/useIsMount';
import Prompt from '../../../shared/components/Prompt';
import Cookies from 'cookies-js';

let recorder;
let videoState;

let cameraStream;
let screenStream;

class VideoState {
  part;
  uid;
  cache;
  uploadId;
  finishCallback;

  constructor(uid, finishCallback) {
    this.part = 0;
    this.uid = uid;
    this.cache = [];
    this.etags = [];
    this.finished = false;
    this.totalLen = 0;
    this.finishCallback = finishCallback;
  }

  async updateUploadId() {
    const res = await axios.get(baseUrl(`auth/s3/multipart/start/${this.uid}`));
    this.uploadId = res.data;
  }

  async sendPart() {
    const data = new Blob(this.cache);
    this.part += 1;
    const part = this.part;
    this.cache = [];
    const res = await axios.post(baseUrl('auth/s3/multipart/add'), {
      id: this.uid,
      uploadId: this.uploadId,
      partNumber: this.part,
    });
    const url = res.data.url;
    if (this.finished) {
      const prom = axios.put(url, data);
      const upRes = await toast.promise(prom, {
        loading: 'Processing...',
        success: 'Finished',
        error: 'Error processing',
      });
      const etag = upRes.headers.etag;
      this.etags.push({
        ETag: etag,
        PartNumber: part,
      });
      await this.finish();
      await this.finishCallback();
      store.state.recording.desktop = false;
    } else {
      const upRes = await axios.put(url, data);
      const etag = upRes.headers.etag;
      this.etags.push({
        ETag: etag,
        PartNumber: part,
      });
    }
  }

  async setFinished() {
    this.finished = true;
  }

  async finish() {
    const res = await axios.post(baseUrl('auth/s3/multipart/finish'), {
      id: this.uid,
      uploadId: this.uploadId,
      parts: this.etags,
    });
  }

  async addData(data) {
    this.cache.push(data);
    this.totalLen += data.byteLength;
    let _5mb = 5 * 1024 * 1024;
    if (this.totalLen >= _5mb || this.finished) {
      this.totalLen = 0;
      await this.sendPart();
    }
  }
}

const VideoRecorder = ({
  recordingId,
  isRecording,
  handleIsRecording,
  handleUploadOrVideo,
  handWritingSide,
  audioRecording,
  videoRecording,
  dismissCameraPrompt //this is set when the user clicks dismiss when we notice that they did not accept the camera
}) => {
  const recorderRef = useRef(null);
  const store = useStore();
  const isMount = useIsMount();
  const [displayMaxTimePrompt, setDisplayMaxTimePrompt] = useState(false);
  const [displayMaxVideosPrompt, setDisplayMaxVideosPrompt] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const maxFreeRecordTime = 45;
  const displayWidth = screen.width;
  const displayHeight = screen.height;
  useEffect(() => {
    if (isMount && store.state.device.platform) {
      setupCamera();
    }
  }, [store.state.device.platform]);

  useEffect(() => {
    if (store.state.device.mode) {
      setupCamera();
    }
  }, [store.state.device.mode]);

  useEffect(() => {
    if (store.state.recording.desktop) {
      // console.debug('BS: store.state.recording.desktop', store.state.recording.desktop);
      setupCamera();
    }
  }, [store.state.recording.desktop]);

  // ? Here i should differenciate between desktop recording and video recordig, 
  const setupCamera = () => {
    // console.debug('BS: setupCamera in VideoRecorder.jsx');
    const options = {
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
        facingMode: store.state.device.mode,
      },
      audio: {
        echoCancellation: true,
      },
    };

    if (
      store.state.device.platform.type === 'desktop' &&
      store.state.device.browser.name === 'Firefox'
    ) {
      options.audio = false;
    }

    // console.warn('BS: store.state.recording:', store.state.recording);

    if (store.state.recording.desktop && (screenStream === undefined || screenStream === null)) {
      // is this correct? i believe not...
      options.video = true;
      // options.audio = false;


      if(document.getElementById('screenvideo')) {
        document.getElementById('screenvideo').remove();
      }
      // Create a new video element for the screen recording
      const screenVideo = document.createElement('video');
      screenVideo.setAttribute('id', 'screenvideo');

      if(document.getElementById('cameravideo')) {
        document.getElementById('cameravideo').remove();
      }
      // Create a new video element for the camera recording
      const cameraVideo = document.createElement('video');
      cameraVideo.setAttribute('id', 'cameravideo');

      // Set the attributes for the screen video element
      screenVideo.setAttribute('autoplay', '');
      screenVideo.setAttribute('muted', '');
      screenVideo.setAttribute('playsinline', '');
      screenVideo.setAttribute('style', 'display:none;');

      // Set the attributes for the camera video element
      cameraVideo.setAttribute('autoplay', '');
      cameraVideo.setAttribute('muted', '');
      cameraVideo.setAttribute('playsinline', '');
      cameraVideo.setAttribute('style', 'display:none;');
      

      // Create a video element to preview the screen recording
      const videoElement = recorderRef.current;

      const controller = new CaptureController();
      controller.setFocusBehavior("no-focus-change");
      const mediaStreamOptions = {
        video: { frameRate: 30, displaySurface: "monitor" },
        audio: false,
        controller
      };

      // Prompt the user to select a monitor to record
      navigator.mediaDevices
        .getDisplayMedia(mediaStreamOptions) // Enable video
        .then(function (device) {
          screenStream = device;
          screenVideo.srcObject = screenStream;

          // Create an interval for the screen recording
          setInterval(function () {
            if (!screenStream.active) {
              if (store.state.recording.desktop) {
                // console.warn('BS: !screenStream.active')
                store.state.recording.desktop = false;
                handleStopRecording();
              }
            }
          }, 1000);
          // console.group('BS: screenStream');
          // console.warn('BS: recordVideo', videoRecording);
          // console.warn('BS: recordAudio', audioRecording);
          // console.warn('BS: handWritingSide', handWritingSide);
          // console.groupEnd();
          if(videoRecording) {
          // Get the user's camera stream         
          return navigator.mediaDevices.getUserMedia({
              video: {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 576, ideal: 720, max: 1080 },
                facingMode: store.state.device.mode,
              },
              audio: false,
              // audio: {
              //   echoCancellation: true,
              // }
            });
          } else {
            return Promise.resolve(false);
          }
        })
        .then(function (device) {
          if(device !== false) {
            cameraStream = device;
            // Merge the screen and camera streams
            cameraVideo.srcObject = cameraStream;
            // Get the user's camera stream 
          }
          if(audioRecording) {        
           return navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
              echoCancellation: true,
            }
          });
          } else {
            return Promise.resolve(false);
          }
        }).then(function (audioStream) {
          
          // now create a canvas, and draw the cameraVideo and the screenVideo elements on it
          const canvas = document.createElement('canvas');

          // first get the origional dimentions of the screenStream
          const minHeight = screenStream.getVideoTracks()[0].getSettings().height;
          const minWidth = screenStream.getVideoTracks()[0].getSettings().width;
          // console.group('BS: ScreenStream');
          // console.warn('BS: screenStream.getVideoTracks()[0]', screenStream.getVideoTracks()[0]);
          // console.warn('BS: getSettings()', screenStream.getVideoTracks()[0].getSettings());
          // console.warn('BS: minWidth', minWidth);
          // console.warn('BS: minHeight', minHeight);
          // console.groupEnd();
          
          function calculateMinimumCanvasSize(minWidth, minHeight) {
            // console.group('BS: calculateMinimumCanvasSize');
            // console.log('BS: minWidth:', minWidth)
            // console.log('BS: minHeight:', minHeight)
            let requiredHeight, requiredWidth;
            if(minHeight <= 360) {
              requiredHeight = 360;
            } else if(minHeight <= 720) {
              requiredHeight = 720;
            } else { 
              requiredHeight = 1080;
            }

            if(minWidth <= 640) { 
              requiredWidth = 640;
            } else if(minWidth <= 1280) {
              requiredWidth = 1280;
            } else {
              requiredWidth = 1920;
            }
            // console.log('BS: requiredHeight:', requiredHeight);
            // console.log('BS: requiredWidth:', requiredWidth);
            // console.groupEnd();
            if(requiredHeight == 1080 || requiredWidth == 1920) {
              return { height: 1080, width: 1920 };
            } else if(requiredHeight == 720 || requiredWidth == 1280) {
              return { height: 720, width: 1280 };
            } else {
              return { height: 360, width: 640 };
            }
          }

          const minimumCanvasSize = calculateMinimumCanvasSize(minWidth, minHeight);
          // console.log('Minimum Canvas Size:', minimumCanvasSize);

          canvas.height = minimumCanvasSize.height;
          canvas.width = minimumCanvasSize.width;

          const screenFocusCanvasHeight = (minimumCanvasSize.height - minHeight) / 2;
          const ScreenFocusCanvasWidth = (minimumCanvasSize.width - minWidth)/2;

          // calculate the dimensions for the cameraVideo
          const cameraWidth = minimumCanvasSize.width/4;
          const cameraHeight = minimumCanvasSize.height/4;
          let cameraX, cameraY;
          if (handWritingSide == 'left') {
            cameraX = (cameraWidth / 4);
            cameraY = canvas.height - (cameraHeight - (cameraHeight / 2)) - 60;
          } else {
            cameraX = canvas.width - (cameraWidth - (cameraWidth / 2)) - 60;
            cameraY = canvas.height - (cameraHeight - (cameraHeight / 2)) - 60;
          }
          const ctx = canvas.getContext('2d');

          function drawVideos() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if(screenStream.getVideoTracks()[0].getSettings().height !== canvas.height && screenStream.getVideoTracks()[0].getSettings().width !== canvas.width) {
              // Make the first screenVideo blurry
              ctx.filter = 'blur(5px)';
              // Add a second filter to make the video darker
              ctx.filter += 'brightness(50%)';
              ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height); // REF: VIDEO 1
              ctx.filter = 'none'; // Reset the filter
              // Draw the second screenVideo normally
            }
            ctx.drawImage(screenVideo, ScreenFocusCanvasWidth,screenFocusCanvasHeight, minWidth,minHeight);  // REF: VIDEO 2

            if(videoRecording) {
              // Save the current context state
              ctx.save();


              // Create a circular path for the cameraVideo
              const radius = cameraWidth / 4;
              const circleX = cameraX + radius;
              const circleY = cameraY - 25;
              ctx.beginPath();
              ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
              ctx.closePath();
              ctx.clip(); // Clip the drawing area to the circular path

              // Draw the cameraVideo centered and inside the circular path
              ctx.drawImage(cameraVideo, (circleX - radius - radius), (circleY - radius), cameraWidth, cameraHeight);  // REF: VIDEO 3

              // Restore the previous context state
              ctx.restore();

              // Create a white border for the circular path
              ctx.strokeStyle = 'white';
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.arc(circleX, circleY, radius + 2, 0, 2 * Math.PI); // REF: CIRCLE
              ctx.stroke();
            }

            // requestAnimationFrame(drawVideos);
            if(store.state.recording.desktop) {
              setTimeout(drawVideos, 1000 / 24);
            }
          }

          drawVideos();


          const stream = canvas.captureStream();
          // console.debug('BS: canvas stream:', stream);
          if(audioStream !== false) {
            // get the audio track from the audioStream
            const audioTrack = audioStream.getAudioTracks()[0];
            // add the audio track to the canvas stream
            stream.addTrack(audioTrack);
          }
          

          // now set the videoElement.srcObject to the canvas.captureStream() stream
          videoElement.srcObject = stream;
          setupRecorder(videoElement, stream);
          handleRecording();
        })
        .catch(function (error) {
          console.error('[setupCamera]', error);
        });
    } else {
      // ? Here the video is started, when I have desktop and video, i could reuse this code to display the face circle in the video
      navigator.mediaDevices
        .getUserMedia(options)
        .then((videoStream) => {
          const videoElement = recorderRef.current;
          if (videoElement) {
            videoElement.srcObject = videoStream;
          }

          setupRecorder(videoElement, videoStream);
        })
        .catch((err) => {
          /* Camera Permission Denied */
          console.error('[setupCamera]', err);
          toast.error('Camera unavailable');
          store.setDeviceAvailability(false);
          return;
        });
    }
  };

  const setupRecorder = (element, stream) => {
    // console.group('setupRecorder')
    // console.debug('BS: setupRecorder in VideoRecorder.jsx');
    // console.debug('BS: element', element);
    // console.debug('BS: stream', stream);
    // console.groupEnd()
    videoState = new VideoState(recordingId, handleUrl);
    videoState.updateUploadId();
    recorder = new RecordRTC(stream, {
      type: 'video',
      disableLogs: true,
      video: element,
      recorderType: MediaStreamRecorder,
      mimeType: 'video/webm;codecs=h264',
      timeSlice: 1000,
      ondataavailable: async (blob) => {
        const res = new Uint8Array(await blob.arrayBuffer());
        await videoState.addData(res);
      },
    });
  };


  const handleStartRecording = () => {
    // console.debug('BS: handleStartRecording in VideoRecorder.jsx');
    if (store.state.videosupport.options.restrictLength === true) {
      //const previousRecording = Cookies.get('videosupport-io-free-recording');
      var free_recording_counter = Cookies.get('free_recording_counter');

      //if (previousRecording) {
      if (free_recording_counter > 3) {
        setDisplayMaxVideosPrompt(true);
      } else {
        const id = setTimeout(async () => {
          setDisplayMaxTimePrompt(true);
        }, maxFreeRecordTime * 1000);

        if (free_recording_counter == null || free_recording_counter == undefined || free_recording_counter == '') {
          free_recording_counter = 2
        } else {
          free_recording_counter++
        }

        Cookies.set('free_recording_counter', free_recording_counter);
        Cookies.set('videosupport-io-free-recording', true);

        setTimeoutId(id);
      }
    }
    recorder.startRecording();
    handleIsRecording(true);
  };


  const handleRecording = async () => {
    if (
      store.state.device.browser.name === 'Safari' &&
      store.state.device.browser.version < '14.0.0' &&
      store.state.device.platform.type === 'mobile'
    )
      return null;

    if (isRecording) {
      await videoState.setFinished();
      await recorder.stopRecording();
      handleIsRecording(false);
    } else if (recorder) {
      handleStartRecording();
    } else {
      if(dismissCameraPrompt) {
        store.state.recording.desktop = true;
        setupCamera();
      } else {
        console.error('No recorder, but there should be one');
      }
    }
  };

  const handleStopRecording = () => {
    // console.debug('BS: handleStopRecording in VideoRecorder.jsx');
    videoState.setFinished();
    recorder.stopRecording();
    if(screenStream != undefined) {
      screenStream.getTracks().forEach(track => track.stop());
    }
    screenStream = undefined;
    handleIsRecording(false);
    // stop screen recording
  }

  const handleUrl = async () => {
    const videoBlob = recorder.getBlob();
    handleUploadOrVideo(videoBlob, { type: 'video' });
  };

  return (
    <div className="video-recorder">
      <div
        className={`dpf cnw aic video-recorder-mask ${isRecording ? 'video-recorder-mask--active' : ''
          }`}
      >
        <video
          ref={recorderRef}
          autoPlay
          playsInline
          loop
          muted
          className="video-display"
        />
        <Gradient display="bottom" />
        <Gradient display="top" />
        {displayMaxTimePrompt && (
          <Prompt
            title="Maximum recording time exceeded"
            text={`Sorry, you're using a free version of Videosupport, which is limited to ${maxFreeRecordTime} seconds of recording time`}
            action={async () => {
              clearTimeout(timeoutId);
              setDisplayMaxTimePrompt(false);
              await videoState.setFinished();
              await recorder.stopRecording();
              handleIsRecording(false);
            }}
            actionLabel="Go back to your recording"
          />
        )}
        {displayMaxVideosPrompt && (
          <Prompt
            title="Maximum number of videos exceeded"
            text={`Sorry, you're using a free version of Videosupport, which is limited to 3 video per customer`}
            action={async () => {
              window.location.href = 'http://videosupport.io';
            }}
            actionLabel="Go back to our website"
          />
        )}
        <button
          className={`record-button ${handWritingSide === 'right'
              ? 'record-button--right'
              : 'record-button--left'
            }`}
          onClick={handleRecording}
          disabled={displayMaxVideosPrompt}
        >
          <Spinner
            isRecording={isRecording}
            disabled={
              store.state.device.browser.name === 'Safari' &&
              store.state.device.browser.version < '14.0.0' &&
              store.state.device.platform.type === 'mobile'
            }
          />
        </button>
      </div>
      <style jsx>{`
        .video-recorder {
          padding: 16px;
          width: 100%;
          height: 100%;
        }
        .video-recorder-mask {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 15px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }
        .video-recorder-mask--active {
          box-shadow: 0 0 0 8px var(--primary);
          -webkit-mask-image: none;
        }
        .video-display {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: url('/assets/layout/loading-camera.jpg') center center /
            cover no-repeat;
          border-radius: 15px;
          overflow: hidden;
        }
        .record-button {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
        }
        .record-button--right {
          left: calc(50% + 0px);
        }
        .record-button--left {
          left: calc(50% - 32px);
        }
      `}</style>
    </div>
  );
};

export default VideoRecorder;
