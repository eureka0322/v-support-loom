import React, { useEffect, useState } from 'react';

import { decode } from 'jsonwebtoken';
import axios from 'axios';
import loadjs from 'loadjs';
import { io } from 'socket.io-client';

import InlineLoader from '../../shared/components/InlineLoader';

import { useQueryString } from '../../shared/hooks/useQueryString';
import { baseUrl } from '../../env.config';
import TopBanner from '../../hsframe/components/TopBanner';
import RequestVideo from '../../hsframe/components/RequestVideo';
import Divider from '../../hsframe/components/Divider';
import RecordedVideos from '../../zendesk/components/RecordedVideos';

const ONE_MINUTE = 60000;
const REFRESH_DELAY = ONE_MINUTE * 0.5;

const CrispSidebar = () => {
  const query = useQueryString();
  const accessToken = query.get('token');
  const { clientId } = decode(accessToken);
  const crisp_email = query.get('crisp_email');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [socketIsLoaded, setSocketIsLoaded] = useState(false);
  const [paymentLink, setPaymentLink] = useState(false);

  var buy_link = baseUrl('/')+'account/billing';

  useEffect(() => {

    if (!socketIsLoaded && sessionId) {

      setSocketIsLoaded(true);
      const socket = io({
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        },
      });

      socket.on('connect', () => {
        socket.emit('join-updates');
      });
      socket.on('new-video', (newVideo) => {
        if (
          newVideo.reservedMetadata.crispSessionId === sessionId ||
          (customerData &&
            customerData.email &&
            newVideo.customer.email === customerData.email)
        ) {
          setVideos((currentVideos) => {
            return [formatVideo(newVideo), ...currentVideos];
          });
        }
      });
    }
  }, [socketIsLoaded, sessionId, setVideos]);


  const countRequestSendLink = async () => {

    var axios_res = axios
      .post(
        baseUrl('/crisp/count-request-send-link'),
        {
          sessionId,
          customer: customerData,
          crisp_email,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {

        var data = response.data

          if(data === true) {

            return true

          } else if(data === 'no_seat') {

             $crisp.showToast(
              'error',
              'Videosupport: You have not allow to send a link by Admin.'
            );
            return false;

          } else if(data === 'plan_expired') {

             $crisp.showToast(
              'error',
              'Videosupport: Your plan is expired. Renew at '+buy_link
            );
            return false;

          } else {

            $crisp.showToast(
              'error',
              'Videosupport: You have requested enough video and now that your trial plan has expired, please upgrade to request more videos Upgrade Plan: '+buy_link
            );
            return false;
          }
      });
      return axios_res
  };

  const sendRequestLinkToChat = async () => {

    if (sessionId) {

      const send_link_status = await countRequestSendLink();

      if(send_link_status === true) {

        axios
          .post(
            baseUrl('/crisp/send-link'),
            {
              sessionId,
              customer: customerData,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            $crisp.showToast(
              'success',
              'Videosupport: Video requested successfully'
            );
          });
      }
    }
  };

  const formatVideo = (video) => {
    let res = {
      id: video.id,
      date: video.recording.recordedAt,
      videoUrl: video.watchUrl,
      thumbnail: video.recording.thumbnailUrl,
    };
    return res;
  };

  const updateVideos = async (email, currentSessionId, callbackSetVideos) => {
    let match = {
      'reservedMetadata.crispSessionId': currentSessionId,
    };
    if (email) {
      match = {
        'customer.email': email,
        ...match,
      };
    }
    await axios
      .post(
        baseUrl('api/videos/match'),
        {
          match,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        callbackSetVideos(response.data.results.map(formatVideo));
      })
      .catch((err) => {
        console.error(`Error retrieving videos: ${err}`);
      });
  };

  useEffect(() => {
    loadjs(
      ['https://assets.crisp.chat/widget/javascripts/sdk.min.js'],
      'crisp'
    );

    loadjs.ready('crisp', {
      success: async () => {
        $crisp.onDataAcquired = async (namespace) => {
          if (namespace === 'conversation') {
            const conversation = $crisp.data[namespace];
            let customer = {
              name: conversation.data.conversation.meta.nickname,
            };
            if (conversation.data.conversation.meta.email !== '') {
              customer = {
                email: conversation.data.conversation.meta.email,
                ...customer,
              };
            }
            setCustomerData(customer);
            setSessionId(conversation.data.conversation.session_id);
            await updateVideos(
              customer.email,
              conversation.data.conversation.session_id,
              setVideos
            );
            setIsLoading(false);
          }
        };
        window.CRISP_READY_TRIGGER = () => {
          $crisp.acquireData('conversation');
        };
      },
      error: (err) => {
        console.error('[loadjs] error', err);
      },
    });
  }, []);

  return (
    <section className="dpf cnw aic videosupport-frame">

      <RequestVideo
        subtitle="Request video"
        subdescription={'Generate a link and send it via the chat'}
        videoLink={'www.google.com'}
        setVideoLink={() => {}}
        sendToChat={{
          active: true,
          action: sendRequestLinkToChat,
        }}
      />

      <RecordedVideos
        subtitle={'Recorded videos'}
        subdescription={'New videos will appear here'}
        videos={videos}
      />
      <Divider />
      <style jsx>{`
        .videosupport-frame {
          width: 100%;
          height: 100%;
          padding: 8px;
        }
      `}</style>
    </section>
  );
};

export default CrispSidebar;
