import axios from 'axios';
import Cookies from 'cookies-js';
import { baseUrl } from '../../env.config';

const ONE_DAY = 24 * 60 * 60;

const loadToken = async (store, token, notifyError) => {
  const notifyErrorFn = notifyError ? notifyError : () => {};
  await axios
    .post(
      baseUrl('account/me'),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((account) => {
      if (account.data.length !== 0) {
        axios
          .get(baseUrl('db/user/organization/data'), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((organization) => {
            store.setOrganizationData(organization.data);
            store.setUserData(account.data);
            store.setBearerToken(token);
            Cookies.set('videosupport-io-token', token, {
              expires: ONE_DAY,
            });
          })
          .catch((err) => {
            console.error(err);
            notifyErrorFn('Organization not found');
          });
      }
    })
    .catch((err) => {
      Cookies.expire('videosupport-io-token');
      console.error(err);
      notifyErrorFn('Authentication failed');
    });
};

export default loadToken;
