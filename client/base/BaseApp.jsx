import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Demo from './pages/Demo';
import CrispDemo from './pages/CrispDemo';
import Recording from './pages/Recording';
import Record from './pages/Record';
import ThankYou from '../shared/pages/ThankYou';
import ComingSoon from '../shared/pages/ComingSoon';
import Error from '../shared/pages/Error';

import { Store } from '../videosupport/store/index';

const BaseApp = () => {
  console.log('[BaseApp]');
  return (
    <BrowserRouter>
      <Store>
        <Toaster position="top-center" reverseOrder={false} toastOptions={{}} />
        <Routes>
          <Route exact path="/demo" element={<Demo />} />
          <Route exact path="/thank-you" element={<ThankYou />} />
          <Route exact path="/crisp-demo" element={<CrispDemo />} />
          <Route path="/recording/:id" element={<Recording />} />
          <Route path="/record" element={<Record />} />
          <Route path="/my-videos" element={<ComingSoon />} />
          <Route path="/my-team" element={<ComingSoon />} />
          <Route path="/getting-started" element={<ComingSoon />} />
          <Route
            path="/401"
            element={
              <Error
                gifUrl="https://media4.giphy.com/media/WuGSL4LFUMQU/giphy.gif"
                title="The page your looking for, isn't meant for you 👀."
              />
            }
          />
          <Route
            path="/404"
            element={
              <Error
                gifUrl="https://media1.giphy.com/media/t9ctG5MZhyyU8/giphy.gif"
                title="We can't find the page you are looking for."
              />
            }
          />
        </Routes>
      </Store>
    </BrowserRouter>
  );
};

export default BaseApp;
