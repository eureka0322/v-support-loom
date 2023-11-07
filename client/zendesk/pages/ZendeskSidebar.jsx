import React, { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import axios from 'axios';
import loadjs from 'loadjs';
import { io } from 'socket.io-client';

import InlineLoader from '../../shared/components/InlineLoader';

import { useQueryString } from '../../shared/hooks/useQueryString';
import { baseUrl } from '../../env.config';
import apiCreateVideoScreen from '../../shared/utils/apiCreateVideoScreen';
import TopBanner from '../../hsframe/components/TopBanner';
import SendVideo from '../../hsframe/components/SendVideo';
import RequestVideo from '../../hsframe/components/RequestVideo';
import Divider from '../../hsframe/components/Divider';
import RecordedVideos from '../components/RecordedVideos';

const ZendeskSidebar = () => {
  const query = useQueryString();
  const accessToken = query.get('token');
  const mode = query.get('mode');
  const [isLoading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [visitorName, setVisitorName] = useState('Customer');
  const [currentZafClient, setCurrentZafClient] = useState(null);
  const [currentCustomerEmail, setCustomerEmail] = useState(null);
  const [currentAgentEmail, setCurrentAgentEmail] = useState(null);
  const [currentVisitorId, setVisitorId] = useState(null);
  const [currentTicketId, setTicketId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [socketIsLoaded, setSocketIsLoaded] = useState(false);
  const [ticketUrl, setTicketUrl] = useState(null);

  const formatVideo = (video) => {
    let res = {
      id: video.id,
      date: video.recording.recordedAt,
      videoUrl: video.watchUrl,
      thumbnail: video.recording.thumbnailUrl,
    };
    return res;
  };

  useEffect(() => {
    if (!socketIsLoaded && currentVisitorId) {
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
      socket.on('new-video', async (newVideo) => {
        if (
          newVideo.reservedMetadata.zendeskVisitorId === currentVisitorId ||
          (currentCustomerEmail &&
            newVideo.customer.email === currentCustomerEmail) ||
          (currentTicketId &&
            newVideo.reservedMetadata.zendeskTicketId === currentTicketId)
        ) {
          setVideos((currentVideos) => {
            return [formatVideo(newVideo), ...currentVideos];
          });
        }
      });
    }
  }, [
    setVideos,
    currentCustomerEmail,
    currentVisitorId,
    currentZafClient,
    currentAgentEmail,
    currentTicketId,
  ]);

  const sendVideoLinkToChat = async (videoLink) => {
    let message;
    if (mode === 'chat') {
      message = `Click on the link to record a video: ${videoLink}`;
    } else {
      message = `<a href=${videoLink}>Click here</a> to record a video!`;
    }
    if (currentZafClient && mode === 'chat') {
      const chat = await currentZafClient.get('chat');
      if (chat.chat.id === null) {
        // Chat hasn't started yet, force agent to join
        await currentZafClient.invoke('chat.joinChat');
      }
      await currentZafClient.invoke('chat.sendChat', message);
    } else if (currentZafClient && mode === 'ticket') {
      await currentZafClient.invoke('ticket.editor.insert', message);
    }
  };

  const videoLinkCallback = async () => {
    const customer = currentCustomerEmail
      ? { email: currentCustomerEmail }
      : {};
    const requester = currentAgentEmail ? { email: currentAgentEmail } : {};
    const metadata = ticketUrl
      ? {
          'Zendesk Ticket': ticketUrl,
        }
      : {};
    const secondaryButton = ticketUrl
      ? {
          secondaryButton: true,
          secondaryButtonText: 'Go to Zendesk ticket',
          secondaryButtonUrl: ticketUrl,
        }
      : {};
    const reservedMetadata = currentVisitorId
      ? {
          zendeskVisitorId: currentVisitorId,
          zendeskTicketId: currentTicketId,
          ...secondaryButton,
        }
      : {};

    // Create request link
    await apiCreateVideoScreen(
      accessToken,
      sendVideoLinkToChat,
      reservedMetadata,
      customer,
      {
        tinyUrl: mode === 'chat',
      },
      [
        {
          name: 'Email requester',
          url: baseUrl('postmark/send/requester'),
        },
      ],
      requester,
      metadata
    );
  };

  const checkForVideos = async (
    customerEmail,
    visitorId,
    callback,
    ticketId,
    agentEmail
  ) => {
    let match = {
      'reservedMetadata.zendeskVisitorId': visitorId,
    };
    if (customerEmail) {
      match = {
        'customer.email': customerEmail,
        ...match,
      };
    }
    if (ticketId) {
      match = {
        'reservedMetadata.zendeskTicketId': ticketId,
        ...match,
      };
    }
    let query = {
      match,
    };
    if (agentEmail) query = { agentEmail, ...query };
    // API request to fetch videos belonging to visitor
    await axios
      .post(baseUrl('api/videos/match'), query, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        callback(response.data.results.map(formatVideo));
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error retrieving videos: ${err}`);
        setLoading(false);
      });
  };

  const genSupportReplyLink = async (callback) => {
    const customer = currentCustomerEmail
      ? { email: currentCustomerEmail }
      : {};
    // Create support reply link
    await apiCreateVideoScreen(
      accessToken,
      callback,
      {
        zendeskVisitorId: currentVisitorId,
        zendeskIsSupportReply: true,
      },
      customer,
      {
        isSupportReply: true,
        showLinkAfterRecording: true,
      },
      []
    );
  };
  // Whenever there's a new visitor, update links and videos
  const updateVisitor = async (
    customerEmail,
    visitorId,
    ticketId,
    agentEmail
  ) => {
    await checkForVideos(
      customerEmail,
      visitorId,
      setVideos,
      ticketId,
      agentEmail
    );
  };

  const setInfo = async (zafClient, key) => {
    const res = await zafClient.get(key);
    let ticketId;
    if (key === 'ticket.requester') {
      const channelName = await zafClient.get('channel.name');
      setChannelName(channelName['channel.name']);
      const ticket = await zafClient.get('ticket.id');
      const accnt = await zafClient.get('currentAccount');
      ticketId = ticket['ticket.id'];
      if (ticketId) {
        setTicketUrl(
          `https://${accnt.currentAccount.subdomain}.zendesk.com/agent/tickets/${ticketId}`
        );
        setTicketId(ticketId);
      }
    }
    if (res[key]) {
      const user = await zafClient.get('currentUser');
      if (user.currentUser.email) setCurrentAgentEmail(user.currentUser.email);
      const customerEmail = res[key].email;
      const visitorId = res[key].id;
      const visitorName = res[key].name;
      setVisitorName(visitorName);
      await updateVisitor(
        customerEmail,
        visitorId,
        ticketId,
        user.currentUser.email
      );
      setCustomerEmail(customerEmail);
      setVisitorId(visitorId);
    } else {
      setLoading(false);
    }
  };

  const setupZafClient = async (zafClient) => {
    setCurrentZafClient(zafClient);
    await zafClient.invoke('resize', {
      width: '100%',
      height: '370px',
    });
    if (mode === 'ticket') {
      await setInfo(zafClient, 'ticket.requester');
      zafClient.on('ticket.requester.id.changed', async () => {
        setLoading(true);
        await setInfo(zafClient, 'ticket.requester');
      });
    } else if (mode === 'chat') {
      await setInfo(zafClient, 'visitor');
      zafClient.on('visitor.email.changed', async () => {
        setLoading(true);
        await setInfo(zafClient, 'visitor');
      });
    }
  };

  useEffect(() => {
    loadjs(
      [
        'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js',
      ],
      'zendesk'
    );

    loadjs.ready('zendesk', {
      success: () => {
        const client = ZAFClient.init();
        setupZafClient(client);
      },
      error: (err) => {
        console.error('[loadjs] error', err);
      },
    });
  }, []);

  return (
    <section className="dpf cnw aic videosupport-frame">
      {isLoading && <InlineLoader message={'loading'} hasBackground={true} />}
      <TopBanner />
      <RequestVideo
        subtitle="Request video"
        subdescription={`Generate a link and send it via the chat.`}
        sendToChat={{
          active: true,
          action: videoLinkCallback,
        }}
      />
      <Divider />
      <RecordedVideos
        subtitle={'Recorded videos'}
        subdescription={'New videos will appear here'}
        videos={videos}
        agent={currentAgentEmail}
      />
      <Divider />
      <SendVideo
        accessToken={accessToken}
        subtitle={'Reply with video'}
        subdescription={`Send a video back to ${visitorName}`}
        genLink={genSupportReplyLink}
      />

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

export default ZendeskSidebar;
