import React from 'react';
import { useAccountStore } from '../../store/index';

const Credentials = () => {
  const store = useAccountStore();
  return (
    <div className="credentials">
      <p className="text text__headline">Logged in as:</p>
      <p className="text text__email">
        {store.state.user.email && store.state.user.email}
      </p>
      <style jsx>{`
        .credentials {
          width: 100%;
          margin-bottom: 16px;
        }

        .text {
          font-size: 14px;
          color: #0b0b0b;
          line-height: 20px;
          word-wrap: break-word;
        }

        .text__headline {
          color: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Credentials;
