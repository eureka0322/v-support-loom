import React from 'react';
import ExternalButton from '../../../shared/components/button/ExternalButton';
import IntegrationBadge from './IntegrationBadge';
import VideoInfo from './VideoInfo';
import VideoActions from './VideoActions';

const RecordingContent = ({ db }) => {
  return (
    <section className="cnw recording-content">
      <div className="rnw jcfe button-wrapper">
        <ExternalButton
          label="Login"
          to="/account/login"
          type="md"
          style="secondary"
        />
        <div className="vsio-spacer--horizontal vsio-spacer--4px"></div>
        <ExternalButton
          label="Get started for free"
          to="/account/login"
          type="md"
          style="primary"
        />
      </div>
      <div className="cnw aic video-content">
        <div className="dpf video-wrapper">
          {db.reservedMetadata &&
            Object.entries(db.reservedMetadata).length !== 0 && (
              <IntegrationBadge metaData={db.reservedMetadata} />
            )}
          <video
            autoPlay
            playsInline
            loop
            muted
            disablePictureInPicture
            controls
            className="video-player"
            src={db.recording.videoUrl}
          />
        </div>
        <div className="rnw aic jcsb video-data">
          <VideoInfo db={db} />
          <VideoActions db={db} />
        </div>
      </div>
      <style jsx>{`
        .recording-content {
          width: 100%;
        }

        .button-wrapper {
          padding: 24px 24px 48px;
        }

        .video-content {
          padding: 0 24px;
          width: 100%;
          max-width: 1150px;
          margin: 0 auto;
        }

        .video-wrapper {
          width: 100%;
          position: relative;
        }

        .video-player {
          border-radius: 5px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: #0b0b0b;
        }

        .video-data {
          width: 100%;
          padding: 16px 16px 0;
        }

        @media only screen and (max-width: 1240px) {
          .button-wrapper {
            padding: 24px;
          }
        }

        @media only screen and (max-width: 824px) {
          .video-data {
            flex-flow: column nowrap;
          }
        }
      `}</style>
    </section>
  );
};

export default RecordingContent;
