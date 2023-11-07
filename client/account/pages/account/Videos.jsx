import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Videos = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Videos" />
    </Wrapper>
  );
};

export default Videos;
