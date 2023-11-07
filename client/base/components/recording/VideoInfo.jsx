import React from 'react';
import Assignee from './Assignee';
import Assignees from './Assignees';

const VideoInfo = ({ db }) => {
  return (
    <div className="rnw aic video-info">
      <Assignee
        text={
          db.customer && db.customer.name ? db.customer.name : 'Videosupporter'
        }
        label={db.recording.recordedAt}
      />
      {db.requester && Object.entries(db.requester).length !== 0 && (
        <React.Fragment>
          <div className="dpf aic jcc arrow"> {'->'} </div>
          <Assignees
            assignees={[
              {
                ...db.requester,
              },
            ]}
          />
        </React.Fragment>
      )}
      <style jsx>{`
        .arrow {
          width: 36px;
          height: 36px;
          font-weight: 500;
          background: #ffffff;
          border: 1px solid var(--light-gray);
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.05);
          border-radius: 50%;
          margin: 0 24px;
        }

        @media only screen and (max-width: 576px) {
          .video-info {
            flex-flow: column nowrap;
          }
          .arrow {
            transform: rotate(90deg);
            margin: 8px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoInfo;
