import React from 'react';
import moment from 'moment';

import { User } from '../../../shared/icons';

const Assignee = ({ text, label, isTeam }) => {
  return (
    <div className={`rnw aic assignee ${isTeam ? 'assignee--team' : ''}`}>
      <div
        className={`dpf jcc aic thumbnail  ${isTeam ? 'thumbnail--team' : ''}`}
      >
        <User fill={'#8614f8'} />
      </div>
      {text && label && (
        <div className="cnw info">
          <div className="name">{text}</div>
          <div className="label">{moment(label).format('DD MMMM YYYY')}</div>
        </div>
      )}
      <style jsx>{`
        .assignee {
          position: relative;
          z-index: 1;
        }
        .assignee--team + .assignee--team {
          margin-left: -24px;
          z-index: 0;
        }
        .thumbnail {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--primary-hsl);
        }

        .thumbnail--team {
          border: 3px solid var(--light-blue);
        }

        .info {
          margin-left: 12px;
        }

        .name {
          font-weight: 500;
        }

        .label {
          font-size: var(--fs-xs);
          color: var(--dark-gray);
          margin-top: 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Assignee;
