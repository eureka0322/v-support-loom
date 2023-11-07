import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../../env.config';

import { useAccountStore } from '../../../store';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import InlineLoader from '../../../../shared/components/InlineLoader';
import Cookies from 'cookies-js';

const ClientSeats = () => {
  const store = useAccountStore();
  const query = useQueryString();
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [totalSelected, setTotalSelected] = useState(null);
  const [maxSeats, setMaxSeats] = useState(null);

  const missingSeats = () => {
    return totalSelected - store.state.client.settings.seats;
  };

  const updateSeat = (member) => {
    const updatedState = {
      ...selectedMembers,
      [member.id]: !selectedMembers[member.id],
    };
    if (updatedState[member.id]) {
      setTotalSelected(totalSelected + 1);
    } else {
      setTotalSelected(totalSelected - 1);
    }
    setSelectedMembers(updatedState);
  };

  const getMaxSeats = () => {
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    axios
      .post(
        baseUrl('db/organization/max-seats'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.data && res.data.maxSeats) setMaxSeats(res.data.maxSeats);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSubmitSeats = async () => {
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    const clientId = store.state.client.id;

    await axios
      .post(baseUrl(`db/client/seats/update`), selectedMembers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response.data.members;
      })
      .catch((err) => {
        console.error(`[Error retrieving organization members] ${err}`);
      });

    setUpdateSuccess(true);
  };

  const invalidNumSeats = () => {
    console.log('totalSelected = ', totalSelected);
    console.log('maxSeats = ', maxSeats);
    return maxSeats !== null && totalSelected > maxSeats;
  };

  useEffect(() => {
    const getOrganizationMembers = async (clientId) => {
      const token =
        query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');

      const resMembers = await axios
        .get(baseUrl(`db/client/members`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return response.data.members;
        })
        .catch((err) => {
          console.error(`[Error retrieving organization members] ${err}`);
        });

      return resMembers;
    };
    if (store.state.client.id) {
      getOrganizationMembers(store.state.client.id).then((resMembers) => {
        setMembers(resMembers);
      });
      getMaxSeats();
    }
    return () => {};
  }, [store.state.client.id]);

  useEffect(() => {
    const selected = {};
    let totalSeats = 0;
    for (const member of members) {
      selected[member.id] = member.hasSeat;
      if (member.hasSeat) {
        totalSeats += 1;
      }
    }
    setSelectedMembers(selected);
    setTotalSelected(totalSeats);
    return () => {};
  }, [members]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setUpdateSuccess(false);
    }, 2000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [updateSuccess]);

  return (
    <div className="dpf cnw settings settings__form">
      {isLoading && <InlineLoader />}
      <header className="header">
        <h2 className="headline">Seats</h2>
      </header>
      <div className="dpf cnw input__group">
        <div className={`dpf cnw input__content`}>
          <div className="input__label">Teammates</div>
          <p className="description text">
            Below you find all teammates. Choose which ones have access to
            videosupport {maxSeats !== null && `(max. ${maxSeats})`}
          </p>
          <div className="current">
            <h3 className="input__label subheadline">
              Access to videosupport:
            </h3>
            {invalidNumSeats() && (
              <p className="description text error">
                You're {missingSeats()} seat{missingSeats() === 1 ? '' : 's'}{' '}
                over your plan. Increase your seats in the{' '}
                <a href={baseUrl('account/billing')}>billing section</a>
              </p>
            )}
            <ul className="dpf cnw teammates">
              {members &&
                members.length !== 0 &&
                Object.keys(selectedMembers).length !== 0 &&
                members.map((user) => {
                  return (
                    <li
                      className="dpf rnw jcsb teammate"
                      onClick={() => {
                        updateSeat(user);
                      }}
                      key={user.email}
                    >
                      <svg
                        width="26px"
                        height="26px"
                        viewBox="0 0 26 26"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        className={
                          selectedMembers[user.id]
                            ? 'icon icon--active'
                            : 'icon'
                        }
                      >
                        <circle
                          id="canvas"
                          className="icon__canvas"
                          cx="13"
                          cy="13"
                          r="13"
                        ></circle>
                        <polyline
                          className="icon__check"
                          points="9 13.5 11.6666667 16 17 11"
                        ></polyline>
                      </svg>
                      <span className="email">{user.email}</span>
                    </li>
                  );
                })}
            </ul>
            <button
              className={`dpif aic jcc button`}
              onClick={handleSubmitSeats}
              disabled={invalidNumSeats()}
            >
              Save
            </button>
            {updateSuccess && 'Updated'}
          </div>
        </div>
      </div>
      <style jsx>{`
        .header {
          margin-bottom: 16px;
        }

        .headline {
          font-size: 22px;
          font-weight: 500;
        }

        .form {
          width: 100%;

          position: relative;
        }

        .input__group {
          width: 100%;
        }

        .input__group + .input__group {
          margin-top: 32px;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
          color: #0b0b0b;
        }

        .description {
          margin: 4px 0 8px;
        }
        .text {
          color: #a1a1a1;
          font-size: 14px;
          line-height: 22px;
        }

        .error {
          color: #e00b0b;
        }

        .current {
          margin: 16px 0;
        }

        .subheadline {
          margin-bottom: 8px;
          text-decoration: underline;
        }

        .teammate {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: #fafafa;
          border: 1px solid #e5e6e6;
          cursor: pointer;
          position: relative;
        }

        .email {
          overflow-wrap: anywhere;
        }

        .teammate:hover {
          border: 1px solid #8614f8;
        }

        .teammate + .teammate {
          margin-top: 6px;
        }

        .icon {
          position: absolute;
          top: calc(50% - 13px);
          left: -13px;
        }

        .icon .icon__canvas {
          fill: #e5e6e6;
        }

        .icon .icon__check {
          stroke-width: 2.43;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke: #fafafa;
        }

        .icon--active .icon__canvas {
          fill: #8312f3;
        }

        .icon--active .icon__check {
          stroke: white;
        }

        .input__text:disabled {
          cursor: not-allowed;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }

        .input__text:-webkit-autofill {
          box-shadow: 0 0 0 30px white inset;
          border: 1px solid #e5e6e6;
          -webkit-text-fill-color: #0b0b0b;
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .checkbox {
          width: 16px;
          height: 16px;
          border-radius: 5px;
          border: 1px solid #e5e6e6;
          background: transparent;
          margin: 0 4px 0 0;
        }

        .checkbox:checked {
          border: 1px solid #6606c6;
          background: #8614f8;
          background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }

        .input__content {
          width: 100%;
        }

        .input__content + .input__content {
          margin-top: 8px;
        }

        .input__content:last-child {
          margin-bottom: 16px;
        }

        .checkbox + .input__label {
          margin: 4px 0 0;
          line-height: 8px;
        }

        .button {
          align-self: flex-start;
          padding: 16px 24px 14px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: white;
          background: #8614f8;
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
          cursor: pointer;
          user-select: none;
          margin: 8px 0 0;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
        }

        .button:hover {
          color: white;
          background: #6606c6;
        }

        .button:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ClientSeats;
