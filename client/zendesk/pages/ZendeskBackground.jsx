import React, { useEffect, useState } from 'react';
import loadjs from 'loadjs';
import { io } from 'socket.io-client';

import { useQueryString } from '../../shared/hooks/useQueryString';

const ZendeskBackground = () => {
  const query = useQueryString();
  const accessToken = query.get('token');
  const [topBar, setTopBar] = useState(null);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [zafClient, setZafClient] = useState(null);
  const [agent, setAgent] = useState(null);

  const notifyNewVideo = async (video) => {
    let newVideoMsg;
    if (video.customer.email) {
      newVideoMsg = `New video from ${video.customer.email}!`;
    } else {
      newVideoMsg = `New video from customer!`;
    }
    let message = `<b>New video!</b><br> <a href="${video.watchUrl}" target="_blank">Watch it</a>`;
    const ticketUrl = video.metadata['Zendesk Ticket'];
    if (ticketUrl) {
      message = `${message}<br><a href="${ticketUrl}">Go to ticket</a>`;
    }
    // 10 seconds notice time
    const noticeTime = 10000;
    await zafClient.invoke('notify', message, 'notice', noticeTime);
    setTimeout(() => {
      topBar.invoke('popover', 'show');
    }, noticeTime);
  };

  useEffect(() => {
    if (topBar) {
      topBar.invoke('preloadPane');
    }
  }, [topBar]);

  useEffect(() => {
    if (!socketLoaded && zafClient && topBar && agent) {
      setSocketLoaded(true);
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
      socket.on('new-video', notifyNewVideo);
    }
  }, [socketLoaded, zafClient, topBar, agent]);

  // Effect to invoke the preloadPane of the top bar, which will start listening
  // for updates from socket
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
        setZafClient(client);
        client.get('currentUser').then((acc) => {
          setAgent(acc.currentUser.email);
        });
        client.get('instances').then((data) => {
          const instances = data.instances;
          for (const instanceGuid in instances) {
            const instance = instances[instanceGuid];
            if (instance.location === 'top_bar') {
              setTopBar(client.instance(instanceGuid));
            }
          }
        });
      },
      error: (err) => {
        console.error('[loadjs] error', err);
      },
    });
  }, []);

  // Zendesk requires to return something, even though it's not displayed anywhere
  return 'ok';
};

export default ZendeskBackground;
