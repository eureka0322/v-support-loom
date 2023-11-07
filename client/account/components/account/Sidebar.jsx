import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'cookies-js';

import AppLogo from '../../../shared/components/AppLogo';
import Navigation from './Navigation';
import Credentials from './Credentials';

import { Logout } from '../../../shared/icons/';
import { useAccountStore } from '../../store';

const Sidebar = () => {
  const navigate = useNavigate();
  const store = useAccountStore();

  const handleLogout = (e) => {
    e.preventDefault();
    Cookies.expire('videosupport-io-token');
    store.setBearerToken(undefined);
    store.setUserData({ id: null, name: null, email: null, photo: null });
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="dpf cnw jcsb content">
        <div className="content__top">
          <AppLogo />
          <Navigation />
        </div>
        <div className="content__bottom">
          <Credentials />
          <div className="dpf aic form__logout">
            <button
              onClick={handleLogout}
              role="click"
              className="dpf jcc aic dashboard__list__item__link dashboard__list__item__link--secondary button"
            >
              <Logout />
              <span className="dashboard__list__item__label">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .sidebar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          column-gap: 16px;
          background: #fafafa;
          width: 100%;
          height: 100vh;
          grid-column: span 7;
          padding: 40px 0;
        }
        .content {
          width: 100%;
          grid-column: 2 / span 5;
        }

        .button {
          width: 100%;
          cursor: pointer;
        }

        @media only screen and (max-width: 1050px) {
          .sidebar {
            grid-column: span 4;
          }
          .content {
            grid-column: 2 / span 5;
          }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
