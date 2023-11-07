import React from 'react';

const VideoTypeContent = ({ title, description, imageSource }) => {
  return (
    <div className="dpf cnw videotype">
      <div className="headline">{title}</div>
      <p className="description text">{description}</p>
      <img src={imageSource} alt={`stuck's ${title}`} className="visual" />
      <style jsx>{`
        .videotype {
          position: relative;
          width: 100%;
          padding: 24px;
          border: 1px solid #8614f8;
          border-radius: 5px;
          margin-top: 16px;
          overflow: hidden;
        }

        .headline {
          font-weight: 500;
          font-size: 18px;
        }
        .description {
          margin-top: 8px;
          width: 100%;
          max-width: 55%;
        }
        .text {
          font-size: 14px;
          line-height: 22px;
          color: #a1a1a1;
        }

        .visual {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 125px;
        }
      `}</style>
    </div>
  );
};

export default VideoTypeContent;
