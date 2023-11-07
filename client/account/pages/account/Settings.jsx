import React from 'react';

import Wrapper from '../../components/account/Wrapper';
import Sidebar from '../../components/account/Sidebar';
import Content from '../../components/account/Content';

const Settings = () => {
  return (
    <Wrapper>
      <Sidebar />
      <Content title="Settings" />
    </Wrapper>
  );
};

export default Settings;
