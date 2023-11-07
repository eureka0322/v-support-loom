import React from 'react';

import Logo from './Logo';
import LoaderWithText from './LoaderWithText';

const FullPageLoader = () => {
  return (
    <div className="dpf cnw jcc aic loader-screen">
      <Logo version="coloured" size="1pt25" />
      <LoaderWithText text="Loading" style="dark" />
      <style jsx>{`
        .loader-screen {
          position: fixed;
          top: 0;
          left: 0;
          background: var(--white);
          width: 100%;
          height: 100%;
          z-index: 100;
        }
      `}</style>
    </div>
  );
};

export default FullPageLoader;
