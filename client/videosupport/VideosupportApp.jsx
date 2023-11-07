import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import RecordPage from './pages/app/RecordPage';
import Complete from './pages/app/Complete';

import Error from '../shared/pages/Error';

import { Store } from './store/index';

const VideosupportApp = () => {
  console.log('[VideosupportApp]');
  return (
    <BrowserRouter basename="v">
      <Store>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/record/:payload" element={<RecordPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/complete" element={<Complete />} />
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

export default VideosupportApp;
