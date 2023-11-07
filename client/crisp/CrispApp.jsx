import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OutOfBusiness from '../hsframe/pages/OutOfBusiness';
import CrispSidebar from './pages/CrispSidebar';
import { AccountStore, useAccountStore } from '../account/store/index';

const CrispApp = () => {

  const store = useAccountStore();

  return (
    <BrowserRouter basename="crisp">
      <AccountStore>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/frame/chat" element={<CrispSidebar />} />
          <Route
            path="/frame/end-of-trial"
            element={
              <OutOfBusiness
                title={'💜 How was it?'}
                description={
                  "Unfortunately, your trial has ended... Did you like it? If you would like to continue using videosuport, we're happy to hear from you!"
                }
              />
            }
          />
          <Route
            path="/frame/out-of-seats"
            element={
              <OutOfBusiness
                title={'💜 How was it?'}
                description={
                  "Unfortunately, you don't have permission using videosupport. Contact your support manager. If you don't know what happened, we're happy to help!"
                }
              />
            }
          />
        </Routes>
      </AccountStore>
    </BrowserRouter>
  );
};

export default CrispApp;
