import React, { useEffect, useState } from 'react';

import { useAccountStore } from '../../store/index';
import FullPageLoader from '../../../shared/components/FullPageLoader';

const Wrapper = ({ children }) => {
  const store = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasUser = !!store.state.user.id;
    if (hasUser) {
      setIsLoading(false);
    }
  }, [store.state.user]);

  return (
    <div className="account">
      {isLoading && <FullPageLoader />}
      {children}
      <style jsx>{`
        .account {
          display: grid;
          grid-template-columns: repeat(32, 1fr);
          column-gap: 16px;
          width: 100%;
          height: 100%;
          overflow-y: hidden;
        }
      `}</style>
    </div>
  );
};

export default Wrapper;
