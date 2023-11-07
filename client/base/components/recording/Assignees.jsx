import React from 'react';

import Assignee from './Assignee';

const Assignees = ({ assignees }) => {
  const renderName = () => {
    if (assignees && assignees.length >= 2) {
      const names = [];
      assignees.map((assignee) => {
        const name = assignee.name.split(' ')[0];
        names.push(name);
      });
      return names.join(', ');
    } else {
      return assignees[0].name || 'Support agent';
    }
  };

  return (
    <div className="rnw aic assignees">
      {assignees &&
        assignees.length !== 0 &&
        assignees.map((data) => {
          return (
            <Assignee
              key={data.name || data.email}
              isTeam={assignees.length >= 2}
            />
          );
        })}
      <div className="cnw info">
        <div className="name">{renderName()}</div>
        <div className="label">handling your request</div>
      </div>
      <style jsx>{`
        .assignees {
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

export default Assignees;
