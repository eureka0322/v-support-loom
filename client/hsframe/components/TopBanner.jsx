import React from 'react';
import Logo from '../../shared/components/Logo';

const TopBanner = () => {
  return (
    <a href="https://videosupport.io" className="dpif link" target={'_blank'}>
      <Logo version="dark" />
      <style jsx>{`
        .link:hover {
          opacity: 0.5;
        }
      `}</style>
    </a>
  );
};

export default TopBanner;
