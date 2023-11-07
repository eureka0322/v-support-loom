import React from 'react';
import moment from 'moment';

const VideoListItem = ({
  date,
  videoUrl,
  ticketCb,
  thumbnail,
  isTopBar,
  isUnassigned,
}) => {
  return (
    <li
      key={date}
      className={`dpf rnw video-list-item ${
        isTopBar ? 'video-list-item--full' : ''
      }`}
    >
      <a
        href={videoUrl}
        className={`dpf rnw jcsb video-list-item-link`}
        target="_blank"
      >
        <div className="dpf aic left">
          <img
            src={thumbnail}
            alt="videosupport thumbnail"
            className="thumbnail"
            width={42}
            height={42}
          />
          <span className="dpf cnw text__wrapper">
            <span className="title">{moment(date).format('DD/MM')}</span>
            <span className="description">{moment(date).format('HH:mm')}</span>
          </span>
        </div>
        <div className="dpf aic right">
          {ticketCb && (
            <a
              href="#"
              className="dpf aic button"
              onClick={(e) => {
                e.preventDefault();
                ticketCb();
              }}
            >
              <svg
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path d="M 30.476562 9.9785156 A 1.50015 1.50015 0 0 0 30.257812 10 L 6.5 10 C 4.5850452 10 3 11.585045 3 13.5 L 3 18.529297 A 1.50015 1.50015 0 0 0 4.6855469 20.017578 C 4.7768507 20.006165 4.8888235 20 5 20 C 7.2307895 20 9 21.769211 9 24 C 9 26.230789 7.2307895 28 5 28 C 4.8888235 28 4.7768507 27.993802 4.6855469 27.982422 A 1.50015 1.50015 0 0 0 3 29.470703 L 3 34.5 C 3 36.414955 4.5850452 38 6.5 38 L 30.253906 38 A 1.50015 1.50015 0 0 0 30.740234 38 L 41.5 38 C 43.414955 38 45 36.414955 45 34.5 L 45 29.470703 A 1.50015 1.50015 0 0 0 43.314453 27.982422 C 43.223149 27.993835 43.111176 28 43 28 C 40.769211 28 39 26.230789 39 24 C 39 21.769211 40.769211 20 43 20 C 43.111176 20 43.223149 20.006198 43.314453 20.017578 A 1.50015 1.50015 0 0 0 45 18.529297 L 45 13.5 C 45 11.585045 43.414955 10 41.5 10 L 30.746094 10 A 1.50015 1.50015 0 0 0 30.476562 9.9785156 z M 6.5 13 L 29 13 L 29 14.5 A 1.50015 1.50015 0 1 0 32 14.5 L 32 13 L 41.5 13 C 41.795045 13 42 13.204955 42 13.5 L 42 17.203125 C 38.640527 17.710754 36 20.504972 36 24 C 36 27.495028 38.640527 30.289246 42 30.796875 L 42 34.5 C 42 34.795045 41.795045 35 41.5 35 L 32 35 L 32 33.5 A 1.50015 1.50015 0 0 0 30.476562 31.978516 A 1.50015 1.50015 0 0 0 29 33.5 L 29 35 L 6.5 35 C 6.2049548 35 6 34.795045 6 34.5 L 6 30.796875 C 9.3594726 30.289246 12 27.495028 12 24 C 12 20.504972 9.3594726 17.710754 6 17.203125 L 6 13.5 C 6 13.204955 6.2049548 13 6.5 13 z M 30.476562 17.978516 A 1.50015 1.50015 0 0 0 29 19.5 L 29 21.5 A 1.50015 1.50015 0 1 0 32 21.5 L 32 19.5 A 1.50015 1.50015 0 0 0 30.476562 17.978516 z M 30.476562 24.978516 A 1.50015 1.50015 0 0 0 29 26.5 L 29 28.5 A 1.50015 1.50015 0 1 0 32 28.5 L 32 26.5 A 1.50015 1.50015 0 0 0 30.476562 24.978516 z" />
              </svg>
            </a>
          )}
          {isTopBar && isUnassigned && <div className="dot" />}
        </div>
      </a>
      <style jsx>{`
        .video-list-item {
          width: 100%;
          max-width: 50%;
        }

        .video-list-item--full,
        .video-list-item-link {
          width: 100%;
          max-width: 100%;
        }

        .video-list-item {
          padding: 4px 0;
        }

        .video-list-item:hover .title {
          color: #8614f8;
        }

        .thumbnail {
          width: 42px;
          height: 42px;
          object-fit: cover;
          border-radius: 5px;
          margin-right: 8px;
        }
        .title {
          font-size: 15px;
          line-height: 10px;
          color: #0b0b0b;
          font-weight: 500;
        }
        .description {
          font-size: 12px;
          line-height: 10px;
          margin-top: 9px;
          color: #a1a1a1;
          font-weight: 500;
        }

        .button {
          padding: 4px 6px;
          border: 1px solid #e5e6e6;
          border-radius: 5px;
        }

        .button:hover {
          border: 1px solid #8614f8;
        }

        .dot {
          background: #ff1212;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-left: 16px;
        }
      `}</style>
    </li>
  );
};

export default VideoListItem;
