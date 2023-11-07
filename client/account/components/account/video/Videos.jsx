import React from 'react';

import Video from './Video';

const Videos = (videos) => {
  return (
    <article className="dpf rw videos">
      {videos.videos &&
        Object.entries(videos).length !== 0 &&
        Object.entries(videos).map(([key, value]) => {
          return Object.values(value)
            .sort((a, b) => b.recording.recordedAt - a.recording.recordedAt)
            .map((video) => {
              if (video && video.id) {
                const kId = Object.keys(value).find((k) => value[k] === video);
                return <Video key={video.id} docRef={kId} {...video} />;
              }
            });
        })}
      {Object.keys(videos.videos).length === 0 && (
        <p className="description text">No recorded videos yet</p>
      )}
      <style jsx>{`
        .videos {
          display: grid;
          grid-template-columns: repeat(24, 1fr);
          grid-gap: 16px;
          align-items: flex-start;
          width: 100%;
        }
        .description {
          grid-column: span 8;
        }
      `}</style>
    </article>
  );
};

export default Videos;
