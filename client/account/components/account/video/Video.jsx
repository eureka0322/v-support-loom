import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import { baseUrl } from '../../../../env.config';
import { useAccountStore } from '../../../store';
import { useQueryString } from '../../../../shared/hooks/useQueryString';

const Video = ({ docRef, recording }) => {
  const store = useAccountStore();
  const query = useQueryString();
  const token =
        query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');

  const [isEditClicked, setIsEditClicked] = useState(false);
  const [videoCaption, setVideoCaption] = useState(recording.caption);
  const [inputVal, setInputVal] = useState(recording.caption);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleEditButtonClick = () => {
    setIsEditClicked(!isEditClicked);
    if(!isEditClicked) setInputVal(videoCaption);
  };

  const saveVideoCaption = async () => {
    const inputElement = document.getElementById("captionInput");
    const caption = inputElement.value;
    
    const updatedData = {
      recording:{
        ...recording,
        caption: caption
      }
    };

    axios.put(baseUrl(`db/client/recordings/${docRef}`), updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      if (response.status === 200) {
        setVideoCaption(caption);
      } else {
        alert("Something went wrong");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Something went wrong");
    })
    .finally(() => {
      setIsEditClicked(!isEditClicked);
    });
      
  };
  
  const handleDeleteButtonClick = async () => {

    if(!confirm('Are you sure you want to delete the video?')) return;
  
    const response = await axios.delete(baseUrl(`db/client/recordings/${docRef}`), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })    
    .then(response => {
      if (response.status === 200) {
        setIsDeleted(true);
      } else {
        alert("Something went wrong");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Something went wrong");
    });
  };

  const handleCancelButtonClick  = () => {
    setInputVal(videoCaption);
    setIsEditClicked(false);
  };

  const preventNavigate = (e) => {
    e.preventDefault();
  };

  return (
    !isDeleted && (
      <a
        target="_blank"
        rel="noreferrer"
        href={baseUrl(`/recording/${docRef}?type=support`)}
        className="dpf cnw jcc aic video"
      >
        
        <div className="thumbnail">
        <div className='svg-container'>
          <a>
          <svg
          width="33px"
          height="33px"
          viewBox="0 0 49 49"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="play__button video-btn"
        >
          <circle
            className="circ"
            fill="#8614F8"
            cx="24.0241434"
            cy="24.0241434"
            r="24.0241434"
          ></circle>
          <polygon
            className="play__icon"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            fill="#FFFFFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="20.1283364 18.1804329 29.2185528 24.0241434 20.1283364 29.867854"
          ></polygon>
        </svg>
          </a>
          <a id="edit-video-btn" onClick={handleEditButtonClick} onClickCapture={preventNavigate}>
            <svg fill="#7ed0ec" width="36px" height="36px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" className='video-btn'>
              <circle cx="12" cy="12" r="9" fill="white"/>
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM10,16,7,17l1-3,7-7,2,2Z"/>
            </svg>
          </a>
          <a id="delete-video-btn" onClick={handleDeleteButtonClick} onClickCapture={preventNavigate}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 28 28" fill='#E74C3C' className='video-btn'>
              <circle cx="12" cy="12" r="9" fill="white"/>
              <path d="M13.98,0C6.259,0,0,6.261,0,13.983c0,7.721,6.259,13.982,13.98,13.982c7.725,0,13.985-6.262,13.985-13.982
                C27.965,6.261,21.705,0,13.98,0z M19.992,17.769l-2.227,2.224c0,0-3.523-3.78-3.786-3.78c-0.259,0-3.783,3.78-3.783,3.78
                l-2.228-2.224c0,0,3.784-3.472,3.784-3.781c0-0.314-3.784-3.787-3.784-3.787l2.228-2.229c0,0,3.553,3.782,3.783,3.782
                c0.232,0,3.786-3.782,3.786-3.782l2.227,2.229c0,0-3.785,3.523-3.785,3.787C16.207,14.239,19.992,17.769,19.992,17.769z"/>
            </svg>
          </a>
        </div>

        </div>
        {!isEditClicked && (
          <div className="edit-container" onClick={preventNavigate}>
            <span>{videoCaption}</span>
          </div>
        )}
        {isEditClicked && (
          <div className="edit-container" onClick={preventNavigate}>
            <input
              type="text"
              id="captionInput"
              placeholder="Enter video caption"
              value={inputVal} // Add this line to set the value of the input to videoCaption
              onChange={(e) => setInputVal(e.target.value)} // Add this line to update the videoCaption state when the value changes
            />
            <button className="btn-save" onClick={saveVideoCaption}>Save</button>
            <button className="btn-cancel" onClick={handleCancelButtonClick}>Cancel</button>
          </div>
        )}
        <style jsx>{`
          .video {
            position: relative;
            grid-column: span 6;
            width: 100%;
            border-radius: 5px;
            overflow: hidden;
          }
          .circ,
          .play__icon {
            transition: stroke 0.15s ease-in-out, fill 0.15s ease-in-out;
          }
          .video-btn:hover .circ {
            fill: #0C0058;
          }
          .video-btn:hover{
            fill: #0C0058;
          }
          .thumbnail {
            position:relative;
            width: 100%;
            padding-top: 56.25%;
            background: url(${recording.thumbnailUrl}) center center / cover
              no-repeat;
          }
          .svg-container{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .svg-container a {
            margin-left: 8px;
          }
          .edit-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
          }
          
          input[type="text"] {
            width:calc(100% - 40px);
            min-width: 120px;
            padding: 8px;
            margin-right: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
          
          .btn-save {
            padding: 8px 12px;
            background-color: #007bff;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            margin-right:3px;
          }
          .btn-cancel {
            padding: 8px 12px;
            background-color: gray;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
          }
        `}</style>
      </a>
    )
  );
};

export default Video;
