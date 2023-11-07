import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Team = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Team" />
    </Wrapper>
  );
};

export default Team;
