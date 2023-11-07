import React from 'react';

import ContentWrapperWithHeader from '../../hsframe/components/ContentWrapperWithHeader';
import VideoList from './VideoList';

const RecordedVideos = ({ subtitle, subdescription, videos }) => {
  const MAX_DISPLAY_AMOUNT = 10;

  return (
    <section className="dpf cnw aic jcc recorded-videos">
      <ContentWrapperWithHeader
        subtitle={subtitle}
        subdescription={subdescription}
      >
        <VideoList videos={videos} maxDisplayAmount={MAX_DISPLAY_AMOUNT} />
      </ContentWrapperWithHeader>
      <style jsx>{`
        .recorded-videos {
          width: 100%;
        }
      `}</style>
    </section>
  );
};

export default RecordedVideos;
