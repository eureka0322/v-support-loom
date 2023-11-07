import React from 'react';

import { Views } from '../../../shared/icons';

const VideoViews = ({ amount }) => {
  return (
    <div className="rnw aic video-views">
      <div className="icon">
        <Views />
      </div>
      <p className="text">{amount}</p>
      <style jsx>{`
        .video-views {
        }

        .icon {
          width: 24px;
          height: 24px;
        }

        .text {
          font-weight: 500;
          margin-left: 6px;
        }
      `}</style>
    </div>
  );
};

export default VideoViews;
