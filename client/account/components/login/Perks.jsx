import React from 'react';
import Tags from './Tags';
import Clients from './Clients';

const Perks = ({ title, tags }) => {
  return (
    <div className="dpf cnw aic perks">
      <header className="header">
        <h1 className="headline">{title}</h1>
      </header>
      <Tags tags={tags} />
      <Clients />

      <style jsx>{`
        .perks {
          grid-column: 11 / span 13;
          padding: 64px 40px;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.2);
          margin-top: -64px;
          border: 1px solid #8614f8;
          border-radius: 5px;
        }

        .headline {
          font-size: 40px;
          line-height: 64px;
          font-weight: bold;
          color: #fff;
          text-align: center;
        }

        @media only screen and (max-width: 1150px) {
          .perks {
            grid-column: 8 / span 11;
            margin-top: 24px;
            padding: 32px 24px;
          }
          .headline {
            font-size: 32px;
            line-height: 48px;
          }
        }
        @media only screen and (max-width: 890px) {
          .perks {
            grid-column: 6 / span 14;
          }
        }
        @media only screen and (max-width: 768px) {
          .perks {
            grid-column: 2 / span 22;
          }
        }
      `}</style>
    </div>
  );
};

export default Perks;
