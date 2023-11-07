import React from 'react';

const ContentHeader = ({ title }) => {
  return (
    <header className="header">
      <h1 className="headline">{title}</h1>

      <style jsx>{`
        .header {
          width: 100%;
          margin-bottom: 32px;
        }

        .headline {
          font-size: 26px;
          line-height: 32px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
};

export default ContentHeader;
