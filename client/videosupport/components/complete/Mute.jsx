import React from 'react';

const Mute = ({ toggleMute, isVideoMuted }) => {
  return (
    <button onClick={() => toggleMute()} className="dpf jcc aic mute">
      {!isVideoMuted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sound-icon"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="no-sound-icon"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      )}
      <style jsx>{`
        .mute {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
        }
        .mute:active {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </button>
  );
};

export default Mute;
