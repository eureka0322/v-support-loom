import React from 'react';

const Welcome = () => {
  return (
    <section className="dpf cnw welcome">
      <header className="header">
        <h2 className="headline">👋 Welcome at videosupport!</h2>
      </header>
      <div className="start">✅ You're all set</div>
      <style jsx>{`
        .welcome {
          width: 100%;
          grid-column: 2 / span 23;
        }

        .headline {
          font-size: 22px;
          line-height: 30px;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .subheadline {
          font-size: 18px;
          line-height: 26px;
          margin-bottom: 8px;
        }

        .steps {
          width: 100%;
          max-width: 50%;
          margin-left: 15px;
        }

        .step {
          position: relative;
        }

        .step::before {
          content: '•';
          position: absolute;
          top: 0;
          left: -15px;
        }

        .step__span {
          line-height: 24px;
        }

        .step__span + .step__span {
          margin-top: 24px;
        }

        .workspace-id__image {
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default Welcome;
