import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'cookies-js';
import toast from 'react-hot-toast';

import HeadlineWithDescription from '../misc/HeadlineWithDescription';

import { baseUrl } from '../../../env.config';
import { theme } from '../../../theme.config';
import { useStore } from '../../store';

const FeedbackModal = ({ setFeedbackModalVisibility, setIsFeedbackGiven }) => {
  const store = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [feedbackBuffer, setFeedbackBuffer] = useState(null);
  const [feedbackValue, setFeedbackValue] = useState(null);

  const submitFeedback = async () => {
    const hasUser = !!store.state.videosupport.user;

    const data = {
      feedback: feedbackBuffer,
      feedbackText: feedbackValue,
      user: {
        name:
          hasUser && store.state.videosupport.user.name !== null
            ? store.state.videosupport.user.name
            : '',
        email:
          (hasUser &&
            store.state.videosupport.user.email &&
            store.state.videosupport.user.email.length !== 0 &&
            store.state.videosupport.user.email) ||
          store.state.videosupport.visitorEmail ||
          store.state.recording.receiverEmail ||
          '',
        id: store.state.videosupport.contactId || '',
      },
      integration: {
        workspaceId:
          store.state.videosupport.workspaceId ||
          store.state.videosupport.subdomain ||
          store.state.videosupport.widgetId,
        platform: store.state.videosupport.platform,
      },
      createdAt: Date.now(),
    };

    const postFeedback = await axios({
      method: 'POST',
      url: baseUrl('db/customer/feedback/submit'),
      data,
    });

    if (postFeedback.data.status === 'ok') {
      toast.success(
        Object.values(store.state.language.translations).length !== 0
          ? store.state.language.translations.feedback_modal.toast_success
          : 'Thank you for your feedback'
      );
      Cookies.set('videosupport-io-feedback', 'true', {
        expires: 60 * 60 * 24,
      }); // should expire after 24 hours
      setIsFeedbackGiven(true);
      setFeedbackModalVisibility(false);
    } else {
      toast.error(
        Object.values(store.state.language.translations).length !== 0
          ? store.state.language.translations.feedback_modal.toast_fail
          : 'Feedback failed to send'
      );
      setIsFeedbackGiven(true);
      setFeedbackModalVisibility(false);
    }
  };

  const closeFeedbackModal = () => {
    setFeedbackModalVisibility(false);
    setActiveStep(0);
  };

  useEffect(() => {
    if (feedbackBuffer === 'good') {
      if (feedbackValue) {
        setFeedbackValue(null);
      }
    }
  }, [feedbackBuffer]);

  console.log({ feedbackBuffer, feedbackValue });

  return (
    <div className={`modal modal__show`}>
      <div className="modal__inner">
        <button onClick={closeFeedbackModal} className="dpf jcc aic close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0b0b0b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <section className="dpf cnw aic feedback">
          {activeStep === 0 && (
            <HeadlineWithDescription
              headline={
                Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.feedback_modal.title
                  : 'Your opinion matters'
              }
              subheadline={
                Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.feedback_modal.description
                  : 'How was your experience with videosupport?'
              }
              style="in-modal"
            />
          )}
          <div className="dpf rw jcc buttons">
            <button
              className={`dpf aic jcc button__feedback ${
                feedbackBuffer && feedbackBuffer === 'bad'
                  ? 'button__feedback--active'
                  : ''
              }`}
              onClick={() => {
                setFeedbackBuffer('bad');
              }}
            >
              🙁
            </button>
            <button
              className={`dpf aic jcc button__feedback ${
                feedbackBuffer && feedbackBuffer === 'neutral'
                  ? 'button__feedback--active'
                  : ''
              }`}
              onClick={() => {
                setFeedbackBuffer('neutral');
              }}
            >
              😐
            </button>
            <button
              className={`dpf aic jcc button__feedback ${
                feedbackBuffer && feedbackBuffer === 'good'
                  ? 'button__feedback--active'
                  : ''
              }`}
              onClick={() => {
                setFeedbackBuffer('good');
              }}
            >
              😍
            </button>
          </div>
          {feedbackBuffer && (
            <div className="dpf cnw input__group">
              {feedbackBuffer !== 'good' && (
                <input
                  type="text"
                  name="text"
                  id="text"
                  className="input"
                  placeholder="What can we improve?"
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value.length !== 0) {
                      setFeedbackValue(value);
                    }
                  }}
                />
              )}
              <button
                className="button button__primary"
                role={'submit'}
                onClick={() => {
                  submitFeedback();
                }}
              >
                Submit
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="background"></div>
      <style jsx>{`
        .close {
          position: absolute;
          top: 0;
          right: 35px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.2);
        }
        .modal {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 3;
          display: none;
        }

        .modal__inner {
          position: absolute;
          top: 45%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
          padding: 16px;
          max-width: ${store.state.device.platform &&
          store.state.device.platform.type === 'desktop'
            ? '425px'
            : '100%'};
          margin: 0 auto;
        }

        .modal.modal__show {
          display: flex;
          animation: fadeIn 0.6s ease-in;
        }

        .feedback {
          width: 100%;
          background: white;
          padding: 40px 16px 16px;
          background: #ffffff;
          box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .buttons {
          width: 100%;
          margin-top: 16px;
        }

        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: -1;
        }

        .button__feedback {
          padding: 16px 16px 9px;
          background: white;
          border: 1px solid #dddddd;
          border-radius: 50%;
          font-size: 26px;
          line-height: 26px;
          width: 70px;
          height: 70px;
          margin: 0 8px;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
        }
        .button__feedback--active,
        .button__feedback:active {
          border: 1px solid #8614f8;
        }

        .input__group {
          width: 100%;
          margin-top: 24px;
        }

        .input {
          width: 100%;
          padding: 11px 16px;
          border: 1px solid #e5e6e6;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
        }

        .button {
          width: 100%;
          padding: 22px 24px 20px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          margin-top: 8px;
        }

        .button.button__primary {
          color: ${store.state.app.branding.secondaryColour};
          background: ${store.state.app.branding.primaryColour};
          box-shadow: ${theme.button_primary_modal_boxshadow};
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackModal;
