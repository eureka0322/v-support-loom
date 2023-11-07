import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Billing = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Billing" />
    </Wrapper>
  );
};

export default Billing;
