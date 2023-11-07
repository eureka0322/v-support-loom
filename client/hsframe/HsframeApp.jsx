import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import RequestLink from './pages/RequestLink';
import OutOfBusiness from './pages/OutOfBusiness';
import Error from '../shared/pages/Error';

const HsframeApp = () => {
  return (
    <BrowserRouter basename="hubspot">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/end-of-trial"
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
          path="/out-of-seats"
          element={
            <OutOfBusiness
              title={'💜 How was it?'}
              description={
                "Unfortunately, you don't have permission using videosupport. Contact your support manager. If you don't know what happened, we're happy to help!"
              }
            />
          }
        />
        <Route path="/request" element={<RequestLink />} />
        <Route
          render={
            <Error
              gifUrl="https://media1.giphy.com/media/t9ctG5MZhyyU8/giphy.gif"
              title="We can't find the page you are looking for."
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default HsframeApp;
