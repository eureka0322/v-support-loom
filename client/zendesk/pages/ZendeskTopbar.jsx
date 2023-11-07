import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import loadjs from 'loadjs';

import { baseUrl } from '../../env.config';
import { useQueryString } from '../../shared/hooks/useQueryString';
import NotificationDrawer from '../components/NotificationDrawer';

const MAX_VIDEOS = 15;

const ZendeskTopbar = () => {
  const query = useQueryString();
  const accessToken = query.get('token');
  const [videos, setVideos] = useState(null);
  const [socketLoaded, setSocketLoaded] = useState(false);
  const [zafClient, setZafClient] = useState(null);
  const [agent, setAgent] = useState(null);

  const checkUnassignedVideos = async () => {
    axios
      .post(
        baseUrl('api/videos/all'),
        {
          agentEmail: agent,
          maxVideos: MAX_VIDEOS,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async (response) => {
        const newVideos = response.data.results.map(formatVideo);
        setVideos(
          newVideos.reduce((obj, cur) => ({ ...obj, [cur.id]: cur }), {})
        );
      });
  };
  useEffect(() => {
    if (!socketLoaded && agent) {
      checkUnassignedVideos();
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
      socket.on('new-video', (unfmtVideo) => {
        const newVideo = formatVideo(unfmtVideo);
        setVideos((videos) => {
          return {
            ...videos,
            [newVideo.id]: newVideo,
          };
        });
      });
      socket.on('video-assigned', (recordingId) => {
        setVideos((videos) => {
          const newVideos = {
            ...videos,
            [recordingId]: {
              ...videos[recordingId],
              isUnassigned: false,
            },
          };
          return newVideos;
        });
      });
    }
  }, [videos, setVideos, socketLoaded, agent, zafClient]);

  useEffect(() => {
    if (videos && zafClient) {
      const unwatchedVideos = Object.values(videos).reduce((state, video) => {
        if (video.isUnassigned) return (state += 1);
        else return state;
      }, 0);
      let len = unwatchedVideos < 10 ? `${unwatchedVideos}` : `9-plus`;
      const symbolName = len === '0' ? 'default' : `vsio-${len}`;
      zafClient.set('iconSymbol', symbolName);
    }
  }, [zafClient, videos]);

  const formatVideo = (video) => {
    const ticketId = video.reservedMetadata.zendeskTicketId;
    let res = {
      id: video.id,
      date: video.recording.recordedAt,
      videoUrl: video.watchUrl,
      thumbnail: video.recording.thumbnailUrl,
      isUnassigned: !(video.assigned && video.assigned.status),
    };
    if (ticketId) {
      res = {
        ticketCb: () => {
          zafClient.invoke('routeTo', 'ticket', ticketId);
        },
        ...res,
      };
    }
    return res;
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
        client.invoke('resize', {
          width: '300px',
          height: '400px',
        });
        client.get('currentUser').then((res) => {
          setAgent(res.currentUser.email);
        });
        setZafClient(client);
      },
      error: (err) => {
        console.error('[loadjs] error', err);
      },
    });
  }, []);

  return (
    agent &&
    videos && (
      <section className="dpf cnw aic videosupport-frame">
        <NotificationDrawer
          subtitle={'Notifications'}
          videos={Object.values(videos).sort((a, b) => b.date - a.date)}
        />
        <style jsx>{`
          .videosupport-frame {
            width: 100%;
            height: 100%;
            padding: 8px;
          }
        `}</style>
      </section>
    )
  );
};

export default ZendeskTopbar;
