import React from 'react';
import ContentHeader from './ContentHeader';

import OverviewContent from './overview/OverviewContent';
import SettingsContent from './settings/SettingsContent';
import BrandingContent from './branding/BrandingContent';
import VideosContent from './video/VideosContent';
import TeamContent from './team/TeamContent';
import ApiContent from './api/ApiContent';
import BillingContent from './billing/BillingContent';

const Content = ({ title }) => {
  return (
    <section className="content">
      <div className="dpf cnw column__wrapper column__wrapper__2by6">
        <ContentHeader title={title} />
        {title === 'Settings' && <SettingsContent />}
        {title === 'Branding' && <BrandingContent />}
        {title === 'Team' && <TeamContent />}
        {title === 'Video Request Link' && <ApiContent />}
        {title === 'Billing' && <BillingContent />}
      </div>
      {title === 'Overview' && <OverviewContent />}
      <div className="dpf column__wrapper column__wrapper__2by23">
        {title === 'Videos' && <VideosContent />}
      </div>
      <style jsx>{`
        .content {
          display: grid;
          grid-template-columns: repeat(25, 1fr);
          column-gap: 16px;
          grid-column: span 25;
          width: 100%;
          height: auto;
          padding: 48px 0;
          align-items: start;
          grid-template-rows: auto 1fr;
          overflow-y: scroll;
        }

        .column__wrapper__2by6 {
          grid-column: 2 / span 6;
        }

        .column__wrapper__2by23 {
          grid-column: 2 / span 23;
        }
        @media only screen and (max-width: 1050px) {
          .content {
            grid-column: span 28;
          }
        }
      `}</style>
    </section>
  );
};

export default Content;
