import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Overview = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Overview" />
    </Wrapper>
  );
};

export default Overview;
