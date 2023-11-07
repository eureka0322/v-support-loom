import React from 'react';

const Note = ({ text, type }) => {
  return (
    <section className="dpf cnw note__section">
      <header className="header">
        <h1 className="headline">Note</h1>
      </header>
      <div className="note">
        <p className="description text">{text}</p>
      </div>
      <style jsx>{`
        .note__section {
          margin-bottom: 24px;
        }

        .header {
          margin-bottom: 8px;
        }

        .headline {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .note {
          padding: 16px 16px 14px;
          background: #fff6db;
          border: 1px solid #ffc000;
          border-radius: 5px;
        }

        .description {
          width: 100%;
          max-width: 100%;
        }
        .text {
          font-size: 16px;
          line-height: 26px;
          color: #ffc000;
        }

        @media only screen and (max-width: 768px) {
          .description {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default Note;
