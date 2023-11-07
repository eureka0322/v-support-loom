import React from 'react';
import toast from 'react-hot-toast';
import VideoViews from './VideoViews';
import ActionButton from '../../../shared/components/button/ActionButton';
import ExternalButton from '../../../shared/components/button/ExternalButton';
import { Link, Ticket } from '../../../shared/icons';
import { useLocation } from 'react-router-dom';
import { baseUrl } from '../../../env.config';

const VideoActions = ({ db }) => {
  const location = useLocation();
  const copyUrl = () => {
    console.log('[copyUrl]');
    const url = baseUrl(`${location.pathname}${location.search}`);
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Link copied', {
          position: 'right-bottom',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="rnw aic video-actions">
      <VideoViews amount={3} />
      <div className="vsio-spacer--horizontal" />
      <ActionButton
        icon={<Link />}
        label="Copy link"
        onClick={copyUrl}
        type="sm"
        style="secondary"
      />
      {db.metadata['Zendesk Ticket'] && (
        <React.Fragment>
          <div className="vsio-spacer--horizontal vsio-spacer--4px" />
          <ExternalButton
            icon={<Ticket />}
            to={db.metadata['Zendesk Ticket']}
            target="_blank"
            type="sm"
            style="secondary"
          />
        </React.Fragment>
      )}
      <div className="vsio-spacer--horizontal vsio-spacer--4px" />
      <style jsx>{`
        .video-actions {
        }

        @media only screen and (max-width: 824px) {
          .video-actions {
            margin-top: 16px;
          }
        }
        @media only screen and (max-width: 576px) {
          .video-actions {
            margin-top: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoActions;
