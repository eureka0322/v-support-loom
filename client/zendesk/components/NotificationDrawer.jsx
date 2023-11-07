import React, { useState } from 'react';

import ContentWrapperWithHeader from '../../hsframe/components/ContentWrapperWithHeader';
import NotificationTab from './NotificationTab';
import VideoList from './VideoList';

const NotificationDrawer = ({ subtitle, videos }) => {
  const [activeTab, setActiveTab] = useState('all'); // all, unread
  return (
    <section className="dpf cnw aic jcc recorded-videos">
      <ContentWrapperWithHeader subtitle={subtitle}>
        <NotificationTab activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'all' && <VideoList videos={videos} isTopBar={true} />}
        {activeTab === 'unread' && (
          <VideoList
            videos={videos.filter((video) => video.isUnassigned)}
            isTopBar={true}
          />
        )}
      </ContentWrapperWithHeader>
      <style jsx>{`
        .recorded-videos {
          width: 100%;
        }
      `}</style>
    </section>
  );
};

export default NotificationDrawer;
