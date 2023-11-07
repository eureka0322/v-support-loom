import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import ContentWrapperWithHeader from './ContentWrapperWithHeader';
import FrameButton from './FrameButton';

import { baseUrl } from '../../env.config';

const TIMEOUT_LENGTH = 3000;

const SendEmail = ({
  accessToken,
  subtitle,
  subdescription,
  clientEmail,
  customerEmail,
  customerName,
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [firstName, setFirstName] = useState(customerName);

  const sendEmail = () => {
    setEmailSent(true);
    const toastId = toast.loading('Sending...');
    axios
      .post(
        baseUrl('api/email/link'),
        {
          customer: {
            email: customerEmail,
          },
          reservedMetadata: {
            requestedBy: clientEmail,
          },
          senderEmail: clientEmail,
          receiverEmail: customerEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((_) => {
        toast.success('Email sent', {
          id: toastId,
        });
      })
      .catch((err) => {
        console.error(`[sendEmail] ${err}`);
        setEmailSent(true);
        toast.error('Email failed', {
          id: toastId,
        });
      });
  };

  useEffect(() => {
    if (customerName) {
      const name = customerName.trim();
      if (name.slice(-1) === 's') {
        setFirstName(name + `'`);
      } else {
        setFirstName(name + `'s`);
      }
      return () => {};
    }
  }, [customerName]);

  useEffect(() => {
    if (emailSent) {
      setTimeout(() => {
        setEmailSent(false);
      }, TIMEOUT_LENGTH);
    }
  }, [emailSent]);

  return (
    <section className="dpf cnw aic send-email">
      <ContentWrapperWithHeader
        subtitle={subtitle}
        subdescription={subdescription}
      >
        <FrameButton
          onClick={() => sendEmail()}
          label={'Send email'}
          disabled={emailSent}
        />
      </ContentWrapperWithHeader>
      <style jsx>{`
        .send-email {
          width: 100%;
        }
        .description {
          text-align: center;
        }
        .description--small {
          width: 100%;
          max-width: 75%;
          margin: 8px auto 0;
        }
        .text--small {
          font-size: 12px;
          line-height: 22px;
          color: #a1a1a1;
        }
        .underline {
          text-decoration: underline;
          text-decoration-color: #8614f8;
        }
      `}</style>
    </section>
  );
};

export default SendEmail;
