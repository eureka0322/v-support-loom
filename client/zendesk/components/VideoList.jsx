import React from 'react';

import VideoListItem from './VideoListItem';

const VideoList = ({
  videos,
  isTopBar = false,
  maxDisplayAmount = 9999999,
}) => {
  return (
    <ul className={`dpf ${isTopBar ? 'cnw' : 'rw'} video-list`}>
      {videos && videos.length !== 0 ? (
        videos.slice(0, maxDisplayAmount).map((item) => {
          return (
            <VideoListItem key={item.date} {...item} isTopBar={isTopBar} />
          );
        })
      ) : (
        <li className="dpf video-list-item">No videos</li>
      )}
      <style jsx>{`
        .video-list {
          width: 100%;
          margin-top: 8px;
        }

        .video-list-item {
          width: 100%;
        }
      `}</style>
    </ul>
  );
};

export default VideoList;
