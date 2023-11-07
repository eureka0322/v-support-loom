import React from 'react';

const Mask = ({ children }) => {
  return (
    <div className="videosupport-io-mask">
      <div className="mask">{children}</div>
      <div className="background"></div>
      <style jsx>{`
        .videosupport-io {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 16px;
        }
        .mask {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
          -webkit-mask-image: -webkit-radial-gradient(white, black);
        }
        .background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0b0b0b;
        }
      `}</style>
    </div>
  );
};

export default Mask;
