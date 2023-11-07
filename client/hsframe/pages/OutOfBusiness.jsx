import React from 'react';
import ContentWrapperWithHeader from '../components/ContentWrapperWithHeader';
import TopBanner from '../components/TopBanner';
import FrameButton from '../components/FrameButton';

const OutOfBusiness = ({ title, description }) => {
  return (
    <section className="dpf cnw aic videosupport-frame">
      <TopBanner />
      <ContentWrapperWithHeader subtitle={title} subdescription={description}>
        <FrameButton
          linkUrl={'mailto:hello@videosupport.io?subject=End of trial'}
          label={'Contact videosupport'}
        />
      </ContentWrapperWithHeader>
      <style jsx>{`
        .videosupport-frame {
          width: 100%;
          height: 100%;
          padding: 8px;
        }
      `}</style>
    </section>
  );
};

export default OutOfBusiness;
