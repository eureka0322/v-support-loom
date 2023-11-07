import React from 'react';
import TrialBannerGroup from './TrialBannerGroup';

import { useAccountStore } from '../../../store/index';

const Banners = () => {
  // TODO(Joao): _check_v2 trial banner
  const store = useAccountStore();
  return (
    <div className="banner__section">
      <style jsx>{`
        .banner__section {
          width: 100%;
          grid-column: 2 / span 23;
        }
      `}</style>
    </div>
  );
};

export default Banners;
