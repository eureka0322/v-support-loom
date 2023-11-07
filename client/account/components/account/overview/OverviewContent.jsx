import React from 'react';

import Welcome from '../overview/Welcome';
import Banners from '../overview/Banners';

const OverviewContent = () => {
  return (
    <React.Fragment>
      <Welcome />
      <Banners />
    </React.Fragment>
  );
};

export default OverviewContent;
