import React from 'react';

import SidebarNavigation from '../../shared/components/navigation/SidebarNavigation';
import RecordingContent from '../components/record/RecordingContent';

const Record = () => {
  return (
    <div className="rnw videosupport-io">
      <SidebarNavigation />
      <RecordingContent />
      <style jsx>{`
        .videosupport-io {
          overflow-x: hidden;
          background: #fafafa;
          flex-flow: row nowrap;
        }

        @media only screen and (max-width: 1240px) {
          .videosupport-io {
            flex-flow: column nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Record;
