import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Bowser from 'bowser';
import axios from 'axios';
import GenerateQr from './GenerateQr';
import RecordingInProgress from './RecordingInProgress';
import RecordingEnded from './RecordingEnded';

import { baseUrl } from '../../../env.config';

const RecordingModal = ({ headline, description }) => {
  const [isMobileDevice, setMobileDevice] = useState(false);
  const [step, setStep] = useState(0); //0, 1, 2
  const [url, setUrl] = useState('');
  const [isQrScanned, setQrScanned] = useState(false);
  const [isRecordingOnPhone, setRecordingOnPhone] = useState(false); // true, active, false
  const [isVideoProcessing, setVideoProcessing] = useState(false); // true, active, false
  const [vsUrl, setVsUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const browser = Bowser.parse(window.navigator.userAgent);
    if (browser && browser.platform.type === 'mobile') {
      setMobileDevice(true);
    } else {
      setMobileDevice(false);
    }
    const socket = io(baseUrl());
    socket.on('connect', () => {
      axios
        .post(baseUrl('api/open/create/link'), {
          reservedMetadata: {
            wsSessionId: socket.id,
          },
          options: {
            showLinkAfterDone: true,
            tinyUrl: true,
          },
        })
        .then((res) => {
          setUrl(res.data);
        });
      socket.on('link-status', (res) => {
        const msg = res.data;
        if (msg === 'qr-read') {
          setVideoProcessing(false);
          setQrScanned(true);
          setRecordingOnPhone('active');
          setStep(1);
        } else if (msg === 'video-recording') {
          setVideoProcessing(false);
          setRecordingOnPhone('active');
        } else if (msg === 'video-recorded') {
          setRecordingOnPhone(true);
          setVideoProcessing('active');
        } else if (msg === 'video-processed') {
          setVideoProcessing(true);
          setVsUrl(res.url);
          setVideoUrl(res.videoUrl);
          setStep(2);
        }
      });
    });
  }, []);

  const cancelOperation = () => {
    setVsUrl('');
    setVideoUrl('');
    setStep(0);
  };

  return (
    <div className="dpf cnw aic recordin-modal">
      {step === 0 && (
        <GenerateQr
          headline={headline}
          description={description}
          url={url}
          isMobileDevice={isMobileDevice}
          images={[
            {
              id: 'kd92',
              image: '/assets/record/treadmill.png',
              type: 'product',
            },
            {
              id: 'kd91',
              image: '/assets/record/fridge.png',
              type: 'product',
            },
            {
              id: 'kd94',
              image: '/assets/record/liza.png',
              type: 'human',
            },
            {
              id: 'kd90',
              image: '/assets/record/washing.png',
              type: 'product',
            },
            {
              id: 'kd89',
              image: '/assets/record/printer.png',
              type: 'product',
            },
          ]}
        />
      )}
      {step === 1 && (
        <RecordingInProgress
          headline={headline}
          description={description}
          isQrScanned={isQrScanned}
          isRecordingOnPhone={isRecordingOnPhone}
          isVideoProcessing={isVideoProcessing}
          cancelOperation={cancelOperation}
        />
      )}
      {step === 2 && (
        <RecordingEnded
          headline={headline}
          description={description}
          vsUrl={vsUrl}
          videoUrl={videoUrl}
        />
      )}
      <style jsx>{`
        .header {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .container--rec {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default RecordingModal;
