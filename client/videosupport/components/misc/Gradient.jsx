import React from 'react';

const Gradient = ({ display = 'bottom' }) => {
  return (
    <div className={`gradient gradient__${display} `}>
      <style jsx>{`
        .gradient {
          position: absolute;
          width: 100%;
          height: 229px;
          background: linear-gradient(
            180deg,
            rgba(11, 11, 11, 0) 0%,
            #0b0b0b 100%
          );
        }
        .gradient__top {
          transform: rotate(180deg);
          height: 169px;
          left: 0;
          top: 0;
        }
        .gradient__bottom {
          left: 0;
          bottom: 0;
        }
      `}</style>
    </div>
  );
};

export default Gradient;
