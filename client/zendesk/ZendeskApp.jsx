import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ZendeskSidebar from './pages/ZendeskSidebar';
import ZendeskTopbar from './pages/ZendeskTopbar';
import ZendeskBackground from './pages/ZendeskBackground';
import ZendeskOutOfTrial from './pages/ZendeskOutOfTrial';
import OutOfBusiness from '../hsframe/pages/OutOfBusiness';

const ZendeskApp = () => {
  return (
    <BrowserRouter basename="zendesk">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/frame/ticket/sidebar" element={<ZendeskSidebar />} />
        <Route path="/frame/top-bar" element={<ZendeskTopbar />} />
        <Route path="/frame/background" element={<ZendeskBackground />} />
        <Route
          path="/frame/end-of-trial"
          element={(props) => (
            <OutOfBusiness
              {...props}
              title={'💜 How was it?'}
              description={
                "Unfortunately, your trial has ended... Did you like it? If you would like to continue using videosuport, we're happy to hear from you!"
              }
            />
          )}
        />
        <Route
          path="/frame/out-of-seats"
          element={
            <OutOfBusiness
              title={'💜 How was it?'}
              description={"Unfortunately, you don't have a seat"}
            />
          }
        />
        <Route path="/frame/end-of-trial" element={<ZendeskOutOfTrial />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ZendeskApp;
