import { observer } from 'mobx-react';
import React from 'react';
import Header from '../../screensupport/components/Header';
import { ScreensupportStore } from '../../screensupport/store';

const NotSupported = observer(() => {
  return (
    <section className="dpf cnw not-supported">
      <Header title="Meh 🥺" description="Sorry!" />
      <p className="description">
        {ScreensupportStore.device.platform.type === 'mobile' &&
          "We do not support mobile browsers yet. We're working hard. Stay tuned."}
        {ScreensupportStore.device.platform.type !== 'mobile' &&
          ScreensupportStore.device.browser.name === 'Safari' &&
          `Your browser (${ScreensupportStore.device.browser.name}) does not provide the experience we want to deliver. Please use Chrome instead.`}
      </p>
      <p className="description">We hope to help you soon!</p>
      <style jsx>
        {`
          .not-supported {
            margin-bottom: 16px;
          }
          .description {
            width: 100%;
            padding: 16px 32px;
            font-size: 16px;
            color: #a1a1a1;
            letter-spacing: 0;
            line-height: 24px;
            text-align: center;
          }

          .description + .description {
            margin-top: -16px;
          }
        `}
      </style>
    </section>
  );
});

export default NotSupported;
