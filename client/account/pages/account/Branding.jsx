import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Branding = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Branding" />
    </Wrapper>
  );
};

export default Branding;
