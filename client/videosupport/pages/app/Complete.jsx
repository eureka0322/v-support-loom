import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'cookies-js';
import { io } from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';

import { useStore } from '../../store';
import { baseUrl } from '../../../env.config';

import EndOfCompleteInterface from '../../components/complete/EndOfCompleteInterface';
import Logo from '../../../shared/components/Logo';
import FeedbackModal from '../../components/complete/FeedbackModal';
import Gradient from '../../components/misc/Gradient';
import { SpeakerOn, SpeakerOff, Refresh } from '../../../shared/icons';
import RecordingInterfaceButton from '../../../shared/components/button/RecordingInterfaceButton';
import ActionButton from '../../../shared/components/button/ActionButton';

import { addVideoToRecordingDb } from '../../../shared/utils/addVideoToRecordingDb';
import { runHooks } from '../../../shared/utils/runHooks';

const Complete = () => {
  let toasterId;
  const store = useStore();
  const [isSoundVolumeMuted, setSoundVolumeMuted] = useState(false);
  const [isRecordingSubmitted, setIsRecordingSubmitted] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const videoRef = useRef();
  const navigate = useNavigate();

  const handleFormUploadSubmit = async () => {
    // Get a pre-signed URL to put into S3 bucket
    const recordingId = store.state.recordingId;
    const caption = store.state.recording.file.name;
    const getLink = await axios.get(
      baseUrl(`auth/s3/get/video/${recordingId}`)
    );
    const getLinkThumb = await axios.get(
      baseUrl(`auth/s3/get/thumb/${recordingId}`)
    );
    if (!store.state.streamingUpload) {
      const putLink = await axios.get(
        baseUrl(`auth/s3/put/video/${recordingId}`)
      );
      const axiosPut = await axios
        .put(putLink.data.url, store.state.recording.file)
        .then((_) => {
          return {
            status: 'ok',
            caption: caption,
            recordingId: recordingId,
            videoUrl: getLink.data.url,
            expiration: getLink.data.expiration,
            thumbnailUrl: getLinkThumb.data.url,
          };
        })
        .catch((err) => {
          console.error(err);
          return {
            status: 'error',
            err: err,
          };
        });
      return axiosPut;
    } else {
      return {
        status: 'ok',
        caption: caption,
        recordingId: recordingId,
        videoUrl: getLink.data.url,
        expiration: getLink.data.expiration,
        thumbnailUrl: getLinkThumb.data.url,
      };
    }
  };

  function realFileName(name) {
    var lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return name.substring(0, lastDotIndex);
    }
    return name;
  }

  function setFileNameByDate() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    });
    let fileName = `Screen Recording ${formattedDate}`;
    fileName = fileName.replace(/\//g, "-").replace(",", " at");;

    return fileName;
  }

  const handleSubmitRecording = async () => {
    const uploadedFiles = handleFormUploadSubmit();

    toasterId = toast.loading('Sending...');

    uploadedFiles
      .then(async (data) => {
        if (data && Object.keys(data).length !== 0 && data.status === 'ok') {

          console.log(data);
          const videoUrl = data.videoUrl;
          const caption = data.caption? realFileName(data.caption): setFileNameByDate();
          const thumbnailUrl = data.thumbnailUrl;
          const linkExpiration = data.expiration;
          const recordingId = data.recordingId;
          const compressed = false;
          store.setRecordingVideo(
            videoUrl,
            thumbnailUrl,
            linkExpiration,
            () => {}
          );

          let status, refId;
          refId = await addVideoToRecordingDb(
            recordingId,
            store.state.videosupport.linkId,
            store.state.videosupport.clientId,
            store.state.videosupport.customerId,
            {
              ...store.state.recording,
              videoUrl,
              caption,
              thumbnailUrl,
              linkExpiration,
              compressed,
            },
            store.state.device
          )
            .then(async (response) => {
              const refId = response.data;
              await runHooks(store.state.videosupport.linkId, refId);
              return refId;
            })
            .catch((err) => {
              console.error(
                `Add recording to database failed with error ${err}`
              );
            });
          status = true;

          if (status) {
            toast.success(
              Object.values(store.state.language.translations).length !== 0
                ? `${store.state.language.translations.recorded_screen.toast_sent_copy}`
                : 'Video sent',
              {
                id: toasterId,
                duration: 2000,
              }
            );
            store.setDbRecordingRefId(refId);
            setIsComplete(true);
          } else {
            setIsRecordingSubmitted(false);
            toast.error(
              Object.values(store.state.language.translations).length !== 0
                ? `${store.state.language.translations.recorded_screen.toast_sent_failed_copy}`
                : 'Failed to send',
              {
                id: toasterId,
              }
            );
          }
        } else {
          toast.error('Failed to upload video');
        }
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  const handleSubmit = () => {
    handleSubmitRecording();
  };

  useEffect(() => {
    if (socket === null) {
      setSocket(io());
    }
  }, []);
  useEffect(() => {
    if (isComplete && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.pause();
    }
  }, [isComplete]);
  useEffect(() => {
    if (socket === null) {
      setSocket(io());
    }
  }, []);
  useEffect(() => {
    if (socket) {
      socket.emit('video-recorded', store.state.videosupport.linkId);
    }
  }, [socket]);

  useEffect(() => {
    if (socket && isComplete) {
      socket.emit('video-processed', {
        linkId: store.state.videosupport.linkId,
        recordingId: store.state.recordingId,
      });
    }
  }, [socket && isComplete]);

  useEffect(() => {
    if (Object.keys(store.state.videosupport).length === 0) {
      navigate(`/record`);
    }

    return () => {
      store.setRecordingMessage('');
      store.setRecordingSound(false);
    };
  }, []);

  return (
    <div className="cnw aic videosupport-io">
      <div className="video-display">
        <div className="video-display-mask">
          <video
            ref={videoRef}
            autoPlay={
              store.state.device.browser.name !== 'Safari' ? true : false
            }
            loop={store.state.device.browser.name !== 'Safari' ? true : false}
            playsInline={
              store.state.device.browser.name !== 'Safari' ? true : false
            }
            className="video-player"
            muted={
              store.state.device.browser.name !== 'Safari'
                ? isSoundVolumeMuted
                : false
            }
            controls={
              store.state.device.browser.name !== 'Safari' ? false : true
            }
            src={store.state.recording.videoUrl}
          />
          <Gradient display="top" />
          <Gradient display="bottom" />
        </div>
      </div>
      <div className="dpf logo-display">
        <Logo version="light" />
      </div>
      <div className="rnw jcsb vsio-ui-container vsio-ui-top">
        <RecordingInterfaceButton
          icon={<Refresh />}
          onClick={() => navigate('/record')}
          label="Retry"
        />
        <RecordingInterfaceButton
          icon={isSoundVolumeMuted ? <SpeakerOff /> : <SpeakerOn />}
          onClick={() => setSoundVolumeMuted(!isSoundVolumeMuted)}
          label={isSoundVolumeMuted ? 'Off' : 'On'}
        />
      </div>
      <div className="rnw vsio-ui-container vsio-ui-bottom">
        <ActionButton
          style={'primary'}
          type="lg"
          label={'Submit'}
          stretch
          onClick={handleSubmit}
        />
      </div>
      {isComplete && <EndOfCompleteInterface headline="Done" />}
      <style jsx>{`
        .logo-display {
          position: absolute;
          top: 48px;
        }
        .video-display {
          position: relative;
          padding: 16px;
          width: 100%;
          height: 100%;
        }
        .video-display-mask {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 15px;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }
        .video-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default Complete;
