import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useIsMount } from '../../shared/hooks/useIsMount';
import { baseUrl } from '../../env.config.js';

import FullPageLoader from '../../shared/components/FullPageLoader';
import SidebarNavigation from '../../shared/components/navigation/SidebarNavigation';
import RecordingContent from '../components/recording/RecordingContent';
import { useQueryString } from '../../shared/hooks/useQueryString';
import { decode } from 'jsonwebtoken';

const Recording = () => {
  const { id } = useParams();
  const isMount = useIsMount();
  const navigate = useNavigate();
  const query = useQueryString();
  const [db, setDb] = useState(null);
  const [side, setSide] = useState(null);
  const [agent, setAgent] = useState(null);
  const [token, setToken] = useState(null);
  const [assignedAgent, setAssignedAgent] = useState(null);

  useEffect(() => {
    const token = query.get('token');
    if (token) {
      const { side, agent } = decode(token);
      setToken(token);
      setSide(side);
      setAgent(agent);
    } else {
      setSide(query.get('type'));
    }
  }, []);

  useEffect(() => {
    //setAssignedAgent(true);
    if (token) {
      axios
        .post(
          baseUrl(`db/recording/check-assigned`),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setAssignedAgent(res.data);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token && assignedAgent && assignedAgent.status === false && agent) {
      // try to assign
      axios
        .post(
          baseUrl('api/recording/self-assign'),
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status) {
            setAssignedAgent(res.data);
          }
        });
    }
  }, [token, assignedAgent]);

  useEffect(() => {
    async function fetchData() {
      if (isMount) {
        const firestore = await axios({
          method: 'GET',
          url: baseUrl(`db/customer/ref/${id}`),
        }).catch((err) => {
          console.log('error', err);
          setTimeout(() => {
            navigate('/404');
          }, 1000);
        });

        setDb(firestore.data);
      }
    }
    fetchData();
  }, [db]);

  return (
    <div className="rnw videosupport-io">
      {!db ? (
        <FullPageLoader />
      ) : (
        <React.Fragment>
          <SidebarNavigation />
          <RecordingContent db={db} />
        </React.Fragment>
      )}
      <style jsx>{`
        .videosupport-io {
          overflow-x: hidden;
          background: #fafafa;
        }

        @media only screen and (max-width: 1240px) {
          .videosupport-io {
            flex-flow: column nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Recording;
