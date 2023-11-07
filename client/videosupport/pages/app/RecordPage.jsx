import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Bowser from 'bowser';

import Interface from '../../components/record/Interface';

import FullPageLoader from '../../../shared/components/FullPageLoader';
import { useStore } from '../../store';
import { baseUrl } from '../../../env.config';
import { io } from 'socket.io-client';
import { v4 } from 'uuid';

const RecordPage = () => {
  const store = useStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordingId, setRecordingId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSlideUpVisible, setSlideUpVisibility] = useState(false);
  const [handWritingSide, setHandWritingSide] = useState('right'); //right, left
  const [socket, setSocket] = useState(null);
  const [isInterfaceHidden, setIsInterfaceHidden] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(null);
  const navigate = useNavigate();
  const { payload } = useParams();

  useEffect(() => {
    if (socket === null) {
      setSocket(io());
    }
  }, []);

  useEffect(() => {
    if (isLoaded && socket) {
      socket.emit('qr-read', store.state.videosupport.linkId);
    }
  }, [socket, isLoaded]);

  useEffect(() => {
    if (isRecording) {
      socket.emit('video-recording', store.state.videosupport.linkId);
    }
  }, [socket, isRecording]);

  useEffect(() => {
    if (window.navigator.language) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguages = ['nl', 'fr', 'de', 'pt', 'lb', 'vi', 'th'];
      const lang = supportedLanguages.find((lang) => browserLang === lang);
      if (lang) {
        async function getTranslations(lang) {
          await axios
            .get(`/translations/${lang}.json`)
            .then(({ data }) => {
              if (typeof data === 'string' && data.indexOf('DOCTYPE') !== -1)
                return;
              store.setTranslations(lang, data);
            })
            .catch((err) => console.log(err));
        }
        getTranslations(lang);
      }
    }
    const browser = Bowser.parse(window.navigator.userAgent);
    store.setDeviceSpecs({
      ...browser,
      mode: 'environment',
    });
    let jwt;
    if (payload && payload !== 'undefined') {
      try {
        store.setUrlPayload(payload);
        navigate('/record');
        jwt = payload;
      } catch (err) {
        setTimeout(() => {
          handleLoader(false);
          navigate('/404');
        }, 1000);
      }
    } else {
      try {
        jwt = store.restorePayload();
      } catch (err) {
        navigate('/404');
      }
    }

    axios({
      url: baseUrl(`auth/customer/${jwt}`),
      method: 'GET',
    })
      .then((features) => {
        if (features.data && features.data.branding) {
          if (features.data.branding) {
            let branding = {
              primaryColour: features.data.branding.primaryColour,
              secondaryColour: features.data.branding.secondaryColour,
            };
            if (features.data.branding.logo) {
              branding = {
                ...branding,
                logo: features.data.branding.logo,
              };
            }
            if (features.data.referrer) {
              branding = {
                ...branding,
                referrerUrl: features.data.referrer,
              };
            }
            store.setAppBranding(branding);
          }
        }
        const recordingId = v4();
        setRecordingId(recordingId);
        store.setRecordingId(recordingId);
        handleLoader(true);
      })
      .catch((err) => {
        console.error(`[Error authenticating customer] ${err}`);
        navigate('/404');
      });
  }, []);

  const handleLoader = (boolean) => {
    /* smooth loading transition */
    setTimeout(() => {
      setIsLoaded(boolean);
    }, 1000);
  };

  const handleIsRecording = (boolean) => {
    setIsRecording(boolean);
    setIsInterfaceHidden(true);
  };

  const setRecordingOnComplete = (file, videoUrl, thumbnailUrl) => {
    let done = { videoUrl: false, thumbnailUrl: false };

    const callbackGoToComplete = () => {
      navigate('/complete');
    };

    store.setRecordingData(
      {
        recordedAt: Date.now(),
        caption: file.name,
        file,
        videoUrl,
        thumbnailUrl,
      },
      callbackGoToComplete
    );
  };

  const handleUploadOrVideo = (file) => {
    const objectUrl = URL.createObjectURL(file);
    const videoUrl = objectUrl;
    const thumbnailUrl = '';
    setRecordingOnComplete(file, videoUrl, thumbnailUrl);
  };

  return (
    <div className="cnw aic videosupport-io">
      {isLoaded && recordingId ? (
        <Interface
          isRecording={isRecording}
          isInterfaceHidden={isInterfaceHidden}
          recordingId={recordingId}
          setIsRecording={setIsRecording}
          handleIsRecording={handleIsRecording}
          handleLoader={handleLoader}
          uploadPercentage={uploadPercentage}
          setUploadPercentage={setUploadPercentage}
          setIsInterfaceHidden={setIsInterfaceHidden}
          handleUploadOrVideo={handleUploadOrVideo}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          setSlideUpVisibility={setSlideUpVisibility}
          isSlideUpVisible={isSlideUpVisible}
          handWritingSide={handWritingSide}
          setHandWritingSide={setHandWritingSide}
        />
      ) : (
        <FullPageLoader />
      )}
    </div>
  );
};

export default RecordPage;
