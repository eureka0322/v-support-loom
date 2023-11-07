import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'cookies-js';

import { useQueryString } from '../shared/hooks/useQueryString';

import Api from './pages/account/Api';
import Login from './pages/login/Login';
import Overview from './pages/account/Overview';
import Branding from './pages/account/Branding';
import Videos from './pages/account/Videos';
import Settings from './pages/account/Settings';
import Billing from './pages/account/Billing';


import Team from './pages/account/Team';
import Error from '../shared/pages/Error';
import OrgNotFound from './pages/error/OrgNotFound';
import FullPageLoader from '../shared/components/FullPageLoader';
import CreatePassword from './pages/account/CreatePassword';
import loadToken from './utils/loadToken';

import { AccountStore, useAccountStore } from './store/index';

const Authorization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQueryString();
  const store = useAccountStore();

  const token =
    query.get('access_token') ||
    store.state.bearer ||
    Cookies.get('videosupport-io-token');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasUser = !!store.state.user.id;
    if (!hasUser && token) {
      setIsLoading(true);
      loadToken(store, token, toast.error).then((_) => {
        setIsLoading(false);
      });
    } else if (
      location.pathname !== '/register' &&
      location.pathname !== '/create-password'
    ) {
      navigate('/login');
    }
  }, []);

  if (isLoading) return <FullPageLoader />;

  return (
    <Routes>
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/create-password" element={<CreatePassword />} />
      <Route exact path="/overview" element={<Overview />} />
      <Route exact path="/branding" element={<Branding />} />
      <Route exact path="/videos" element={<Videos />} />
      <Route exact path="/api" element={<Api />} />
      <Route exact path="/settings" element={<Settings />} />
      <Route exact path="/billing" element={<Billing />} />
      <Route exact path="/team" element={<Team />} />
      <Route exact path="/error/orgnotfound" element={<OrgNotFound />} />
      <Route
        element={
          <Error
            gifUrl="https://media1.giphy.com/media/t9ctG5MZhyyU8/giphy.gif"
            title="We can't find the page you are looking for."
          />
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter basename="account">
      <AccountStore>
        <Toaster position="right-bottom" reverseOrder={false} />
        <Authorization />
      </AccountStore>
    </BrowserRouter>
  );
};

export default App;
