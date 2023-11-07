import React from 'react';

import Logo from '../Logo';

const Navigation = () => {
  return (
    <nav className="cnw navigation">
      <a href="https://videosupport.io" className="dpf logo__link">
        <Logo version="dark" />
      </a>
      <style jsx>{`
        .navigation {
          width: 100%;
          background: white;
          padding: 32px 24px;
          border-bottom: 1px solid #e5e6e6;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
