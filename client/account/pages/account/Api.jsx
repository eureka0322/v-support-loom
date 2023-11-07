import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Api = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Video Request Link" />
    </Wrapper>
  );
};

export default Api;
