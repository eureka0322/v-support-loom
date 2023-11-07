import React from 'react';
import LogoMark from '../../../shared/components/LogoMark';

import { Crisp, Zendesk, Intercom, Slack } from '../../../shared/icons';

const IntegrationBadge = ({ metaData }) => {
  const renderIcon = () => {
    if (metaData.crispSessionId) {
      return <Crisp />;
    }
    if (metaData.zendeskVisitorId || metaData.zendeskTicketId) {
      return <Zendesk />;
    }
    if (
      metaData.intercomAdminId ||
      metaData.intercomContactId ||
      metaData.intercomConversationId
    ) {
      return <Intercom />;
    }
    if (metaData.slackUserId) {
      return <Slack />;
    }
    if (metaData.wsSessionId) {
      return <LogoMark fill={'#8614f8'} />;
    }

    return null;
  };

  const renderText = () => {
    if (metaData.crispSessionId) {
      return 'Shared on Crisp';
    }
    if (metaData.zendeskVisitorId || metaData.zendeskTicketId) {
      return 'Shared on Zendesk';
    }
    if (
      metaData.intercomAdminId ||
      metaData.intercomContactId ||
      metaData.intercomConversationId
    ) {
      return 'Shared on Intercom';
    }
    if (metaData.slackUserId) {
      return 'Shared on Slack';
    }

    if (metaData.wsSessionId) {
      return 'Shared on Videosupport';
    }
    return null;
  };

  return (
    <div className="rnw aic integration-badge">
      <span className="dpif aic jcc icon">{renderIcon()}</span>
      <p className="text">{renderText()}</p>
      <style jsx>{`
        .integration-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: #ffffff;
          padding: 8px;
          border: 1px solid #e5e6e6;
          border-radius: 5px;
        }

        .icon {
          width: 20px;
          height: 20px;
        }

        .text {
          font-weight: 500;
          line-height: 10px;
          margin-left: 6px;
        }

        @media only screen and (max-width: 576px) {
          .integration-badge {
            padding: 4px 6px;
          }
          .text {
            font-size: var(--fs-xs);
          }
        }
      `}</style>
    </div>
  );
};

export default IntegrationBadge;
