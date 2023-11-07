import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../../env.config';
import { useAccountStore } from '../../../store';
import Cookies from 'cookies-js';

import Videos from './Videos';
import InlineLoader from '../../../../shared/components/InlineLoader';
import { useQueryString } from '../../../../shared/hooks/useQueryString';

const VideosContent = () => {
  const store = useAccountStore();
  const query = useQueryString();
  const [dbRecordings, setDbRecordings] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    async function fetchData() {
      setIsLoading(true);
      const apiResponse = await axios
        .get(baseUrl('db/client/recordings/'), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((err) => {
          console.error(`[Error retrieving videos] ${err}`);
        });

      const recordings = apiResponse.data.recordings;

      if (recordings.length !== 0) {
        setDbRecordings((currentRecordings) => ({
          ...currentRecordings,
          ...Object.values(recordings).reduce(
            (result, recording) => ({
              ...result,
              [recording.docRef]: recording.data,
            }),
            {}
          ),
        }));
      }
      setIsLoading(false);
    }
    fetchData();
  }, [store.state.client.id]);

  return (
    <div className="dpf cnw block">
      <header className="header">
        <h2 className="headline">Customer Videos</h2>
        <p className="description text">
          A collection of all your customers recorded videos.
        </p>
      </header>
      {isLoading && <InlineLoader />}
      <Videos videos={dbRecordings} />
      <style jsx>{`
        .block {
          width: 100%;
          padding-bottom: 64px;
        }

        .header {
          margin-bottom: 16px;
        }

        .headline {
          font-size: 22px;
          font-weight: 500;
        }

        .description {
          margin: 4px 0 8px;
        }
        .text {
          color: #a1a1a1;
          font-size: 14px;
          line-height: 22px;
        }
      `}</style>
    </div>
  );
};

export default VideosContent;
