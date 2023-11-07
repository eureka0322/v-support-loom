import React, { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import axios from 'axios';

import { useQueryString } from '../../shared/hooks/useQueryString';
import { baseUrl } from '../../env.config';
import TopBanner from '../../hsframe/components/TopBanner';

import CrispEmailForm from '../../account/components/login/CrispEmailForm';
import CrispSidebarContent from './CrispSidebarContent';

import { useAccountStore } from '../../account/store';

import Cookies from 'cookies-js';

const CrispSidebar = () => {
  const query = useQueryString();
  const accessToken = query.get('token');
  const crisp_email = query.get('crisp_email');
  const { clientId } = decode(accessToken);

  const [isCrispLogin, setIsCrispLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const store = useAccountStore();

  if(clientId == '2090291c-d3e9-48ce-8bc6-c57efae316bf') {
    setIsCrispLogin(true);
    setEmail('taylor.desilvey@hellolanding.com');
  }

  const getCrispWidgetStatus = () => {

    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');
    axios
      .post(
        baseUrl('account/get_crisp_widget_status'),
        {
          clientId:clientId,
          crisp_email:crisp_email
        },
        //{ headers: { Authorization: `Bearer ${token}` } }
      )
      .then((current) => {
        console.log('get_crisp_widget_status user data = ', current.data)

        if(current.data != false) {

          setIsCrispLogin(true);
          setEmail(current.data.data.email);

        } else {
          setIsCrispLogin(false);
        }
      }).catch((err) => {
        console.log('In error = ', err);
        setIsCrispLogin(false);
    });
  };

  useEffect(() => {
    if (clientId) {
      getCrispWidgetStatus()
    } else {
      setIsCrispLogin(false);
    }
  }, []);

  return (
    <section className="dpf cnw aic videosupport-frame">
      <TopBanner />

      {email !== null && (
        <div className="dpf rnw block">
          <p className="text">
          You are logged in as: {email}
          </p>
      </div>
      )}

      {isCrispLogin ? <CrispSidebarContent /> : < CrispEmailForm/>}

      <style jsx>{`
        .block {
          margin-top: 16px;
        }

        .text {
          color: #0b0b0b;
          font-size: 14px;
          margin-bottom:12px;
          text-align: center;

        }
      `}</style>

    </section>
  );
};

export default CrispSidebar;
