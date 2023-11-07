import React from 'react';

const NotificationTab = ({ activeTab, setActiveTab }) => {
  return (
    <div className="dpf rnw aic notification-tab">
      <button
        className={`dpf jcc tab ${activeTab === 'all' ? 'tab--active' : ''}`}
        onClick={() => setActiveTab('all')}
      >
        All
      </button>
      <button
        className={`dpf jcc tab ${activeTab === 'unread' ? 'tab--active' : ''}`}
        onClick={() => setActiveTab('unread')}
      >
        Unread
      </button>
      <style jsx>{`
        .notification-tab {
          width: 100%;
          border-bottom: 2px solid #e5e6e6;
          margin-top: 16px;
        }

        .tab {
          width: 100%;
          max-width: 100%;
          padding: 8px 16px;
          margin-bottom: -2px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }

        .tab:hover {
          color: #8614f8;
        }

        .tab--active {
          color: #8614f8;
          border-bottom: 2px solid #8614f8;
        }
      `}</style>
    </div>
  );
};

export default NotificationTab;
