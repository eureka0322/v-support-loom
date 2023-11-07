import React from 'react';

const TrialDaysBanner = () => {
  return (
    <div className="dpf jcsb aic banner__trial__days">
      <div className="text">Your trial expires in 3 days</div>
      <button className="upgrade">Upgrade plan</button>
      <style jsx>{`
        .banner__trial__days {
          width: 100%;
          padding: 20px 24px 16px;
          background: #fed7aa;
          border-radius: 3px;
        }
        .text {
          color: #7c2d12;
        }
      `}</style>
    </div>
  );
};

export default TrialDaysBanner;
