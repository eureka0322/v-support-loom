import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../../shared/components/Footer';

import Navigation from '../../../shared/components/navigation/Navigation';
import LoginModal from '../../components/login/LoginModal';
import { useAccountStore } from '../../store';
import loadToken from '../../utils/loadToken';
import Cookies from 'cookies-js';

const Login = () => {
  const navigate = useNavigate();
  const store = useAccountStore();

  useEffect(() => {
    const token = Cookies.get('videosupport-io-token');
    if (token) {
      loadToken(store, token, console.error).then((_) => {
        navigate('/overview');
      });
    }
  }, []);

  return (
    <div className="login">
      <Navigation />
      <div className="container--web grid-24 content">
        <LoginModal />
      </div>
      <Footer style="light" />
      <style jsx>{`
        .login {
          width: 100%;
        }
        .content {
          min-height: calc(100vh - 225px);
          color: white;
          align-items: center;
        }

        @media only screen and (max-width: 1150px) {
          .content {
            grid-template-rows: auto 1fr;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
