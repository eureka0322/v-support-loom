import React from 'react';

import { useStore } from '../../store';

const HeadlineWithDescription = ({
  headline,
  subheadline,
  descriptions,
  style,
}) => {
  const store = useStore();
  return (
    <div
      className={`dpf cnw aic jcc headline-with-description headline-with-description__${style}`}
    >
      {headline && (
        <header className="header">
          <h1 className="headline">{headline}</h1>
        </header>
      )}
      {descriptions &&
        descriptions.map((desc) => {
          return (
            <p key={desc.id} className="description text">
              {desc.text}
            </p>
          );
        })}
      {subheadline && <h2 className="subheadline">{subheadline}</h2>}
      <style jsx>{`
        .headline {
          font-size: 26px;
          font-weight: 700;
          color: ${store.state.app.branding.primaryColour};
          text-align: center;
        }

        .description {
          margin-top: 8px;
          width: 100%;
          max-width: 85%;
        }

        .text {
          font-size: 16px;
          line-height: 26px;
          color: #a1a1a1;
          text-align: center;
        }

        .headline-with-description__in-modal .description {
          max-width: 100%;
        }

        .subheadline {
          font-size: 18px;
          font-weight: 500;
          margin-top: 8px;
          width: 100%;
          text-align: center;
          line-height: 28px;
        }
      `}</style>
    </div>
  );
};

export default HeadlineWithDescription;
