import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import randomstring from 'randomstring';

import { baseUrl } from '../../../env.config';
import { useStore } from '../../store/index';
import { Refresh } from '../../../shared/icons';
import ActionButton from '../../../shared/components/button/ActionButton';

const EndOfCompleteInterface = ({ headline }) => {
  const navigate = useNavigate();
  const store = useStore();
  const [recLink, setRecLink] = useState(null);

  const handleCopyClick = () => {
    if (recLink) {
      navigator.clipboard
        .writeText(recLink)
        .then(() => {
          toast.success('Url copied');
        })
        .catch((err) => {
          console.error('[copy]', err);
          toast.error('Url copied failed');
        });
    }
  };

  const submitEmail = async (email) => {
    const emailToastId = toast.loading(
      Object.values(store.state.language.translations).length !== 0
        ? `${store.state.language.translations.email_modal.toast_email_sending_copy}...`
        : 'Sending confirmation email...'
    );

    const data = {
      customerEmail: email,
      pageUrl: baseUrl(
        `recording/${store.state.db.previousRecordedRefId}?type=customer`
      ),
      thumbnailUrl: store.state.recording.thumbnailUrl,
      videoId: randomstring.generate({ length: 6, charset: 'alphanumeric' }),
      date: store.state.recording.recordedAt,
    };

    const postmark = await axios({
      method: 'POST',
      url: baseUrl('postmark/send/recording'),
      data,
    });

    if (postmark.data.status === 'ok') {
      toast.success(
        Object.values(store.state.language.translations).length !== 0
          ? `${store.state.language.translations.email_modal.toast_email_sent_copy}`
          : 'Confirmation email sent',
        {
          id: emailToastId,
        },
        4000
      );
    } else {
      toast.error(
        Object.values(store.state.language.translations).length !== 0
          ? `${store.state.language.translations.email_modal.toast_email_fail_copy}`
          : 'Cannot send email'
      );
    }
  };

  useEffect(() => {
    if (
      store.state.videosupport.user &&
      store.state.videosupport.user.email &&
      store.state.videosupport.user.email.length !== 0
    ) {
      submitEmail(store.state.videosupport.user.email);
    }
    setRecLink(baseUrl(`recording/${store.state.recordingId}?type=customer`));
  }, []);

  return (
    <div className="cnw aic slide-up">
      <div className="background" />
      <div className="button-wrapper">
        <ActionButton
          icon={<Refresh />}
          label="Record a new video"
          style={'rounded'}
          type="md"
          onClick={() => navigate('/record')}
        />
      </div>
      <section className="slide-up-interface">
        <div className="cnw vsio-ui-container slide-up-content">
          <header className="cnw aic header">
            <h1 className="headline">{headline}</h1>
          </header>
          <div className="cnw slide-up-content-group">
            <div className="subheadline">Share video</div>
            <div className="description">Copy & share the video</div>
            <div className="cnw input-group">
              <input
                type="url"
                name="url"
                id="url"
                className="input-text"
                value={recLink}
                disabled
              />
              <ActionButton
                style={'primary'}
                stretch
                label={'Copy url'}
                type="lg"
                onClick={handleCopyClick}
              />
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .slide-up {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
        }

        .background {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(11, 11, 11, 0.2);
          z-index: 0;
        }

        .button-wrapper {
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .header {
          width: 100%;
        }

        .headline {
          font-size: var(--fs-xl);
          font-weight: 500;
        }

        .slide-up-interface {
          position: relative;
          width: 100%;
          background: var(--white);
          box-shadow: 0 -3px 1px 0 rgba(0, 0, 0, 0.2);
          border-radius: 12px 12px 0 0;
          padding: 16px;
          z-index: 1;
        }

        .slide-up-content {
          position: relative;
          margin-top: 32px;
          margin-bottom: 16px;
          padding: 0;
        }

        .slide-up-content::before {
          content: '';
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 5px;
          background: #dbdbdb;
          border-radius: 3px;
        }

        .slide-up-content-group {
          margin-top: 24px;
        }

        .subheadline {
          font-size: var(--fs-lg);
          font-weight: 500;
        }

        .description {
          width: 100%;
          max-width: 75%;
          color: var(--dark-gray);
          line-height: 24px;
        }
        .input-group {
          width: 100%;
          margin-bottom: 8px;
        }

        .input-text {
          width: 100%;
          padding: 14px 16px 10px;
          border-radius: 5px;
          font-size: 16px;
          line-height: 21px;
          color: var(--balck);
          background: var(--white);
          border: 1px solid var(--light-gray);
          cursor: not-allowed;
          text-align: center;
          text-overflow: ellipsis;
          margin-bottom: 8px;
        }
      `}</style>
    </div>
  );
};

export default EndOfCompleteInterface;
