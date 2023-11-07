import React, { useEffect, useState } from 'react';

import { useQueryString } from '../../shared/hooks/useQueryString';
import SendVideo from '../components/SendVideo';
import RequestVideo from '../components/RequestVideo';
import SendEmail from '../components/SendEmail';
import InlineLoader from '../../shared/components/InlineLoader';
import Divider from '../components/Divider';
import TopBanner from '../components/TopBanner';
import apiCreateVideoScreen from '../../shared/utils/apiCreateVideoScreen';

const RequestLink = () => {
  // Selector of the current type, applies to e-mail
  // and link request
  const [videoLink, setVideoLink] = useState('');
  const [supportReplyLink, setSupportReplyLink] = useState(null);

  // Parameters from query string
  const query = useQueryString();
  const accessToken = query.get('token');
  const clientEmail = query.get('clientEmail');
  const customerName = query.get('customerName');
  const customerEmail = query.get('customerEmail');

  useEffect(() => {
    apiCreateVideoScreen(
      accessToken,
      setSupportReplyLink,
      {
        createdBy: clientEmail,
        hsTitleDisplay: '[Support reply]',
      },
      {
        email: customerEmail,
      },
      {
        isSupportReply: true,
        showLinkAfterRecording: true,
      }
    );
  }, []);

  return (
    <section className="dpf cnw aic videosupport-frame">
      {videoLink.length === 0 && (
        <InlineLoader message={'loading'} hasBackground={true} />
      )}
      <TopBanner />
      <SendVideo
        accessToken={accessToken}
        subtitle={'Reply with video'}
        subdescription={`Send a video back to ${customerName}`}
        customerName={customerName}
        customerEmail={customerEmail}
        clientEmail={clientEmail}
        link={supportReplyLink}
      />
      <RequestVideo
        accessToken={accessToken}
        subtitle="Request video"
        subdescription={`Copy and send the link to ${customerName}`}
        clientEmail={clientEmail}
        customerEmail={customerEmail}
        customerName={customerName}
        videoLink={videoLink}
        setVideoLink={setVideoLink}
        sendToChat={{
          active: false,
          action: '#',
        }}
      />
      <Divider label="or" />
      <SendEmail
        accessToken={accessToken}
        subtitle="Send link via email"
        subdescription={`Send the video request straight into ${customerName} email`}
        clientEmail={clientEmail}
        customerEmail={customerEmail}
        customerName={customerName}
      />
      <style jsx>{`
        .videosupport-frame {
          width: 100%;
          margin: 0 auto;
          padding: 0 32px;
        }
      `}</style>
    </section>
  );
};

export default RequestLink;
