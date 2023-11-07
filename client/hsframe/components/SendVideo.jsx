import React from 'react';
import ContentWrapperWithHeader from './ContentWrapperWithHeader';
import FrameButton from './FrameButton';
import Divider from './Divider';

const SendVideo = ({ subtitle, subdescription, genLink }) => {
  return (
    <section className="dpf cnw aic send-video">
      <ContentWrapperWithHeader
        subtitle={subtitle}
        subdescription={subdescription}
      >
        <FrameButton
          label={'Reply with video'}
          onClick={() => {
            genLink((linkUrl) => {
              window.open(linkUrl, '_blank');
            });
          }}
        />
      </ContentWrapperWithHeader>
      <Divider />
      <style jsx>{`
        .send-video {
          width: 100%;
        }
        .send-video__wrapper {
          width: 100%;
          padding: 24px 0;
        }
        .highlight {
          color: #8614f8;
        }
        .text {
          color: #a1a1a1;
        }
      `}</style>
    </section>
  );
};

export default SendVideo;
