import React from 'react';
import { useQueryString } from '../../../shared/hooks/useQueryString';

import Navigation from '../../../shared/components/navigation/Navigation';
import CreatePasswordModal from '../../components/login/CreatePasswordModal';
import Footer from '../../../shared/components/Footer';

const CreatePassword = () => {
  const query = useQueryString();
  const token = query.get('token');

  return (
    <div className="create-password">
      <Navigation />
      <div className="container--web grid-24 content">
        <CreatePasswordModal token={token} />
      </div>
      <Footer style="light" />
      <style jsx>{`
        .create-password {
          width: 100%;
        }
        .content {
          min-height: calc(100vh - 225px);
          color: white;
          align-items: center;
        }

        @media only screen and (max-width: 1150px) {
          .content {
            grid-template-rows: auto 1fr;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatePassword;
