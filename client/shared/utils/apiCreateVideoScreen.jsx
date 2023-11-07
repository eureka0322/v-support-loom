import axios from 'axios';
import { baseUrl } from '../../env.config';

const apiCreateVideoScreen = async (
  accessToken,
  videoCallbackSetter,
  reservedMetadata,
  customer,
  options,
  hooks,
  requester,
  metadata
) => {
  const apiUrl = baseUrl('api/create/link');

  const dataGen = () => {
    return {
      reservedMetadata: reservedMetadata,
      customer: customer,
      options: options,
      postRecordHooks: hooks,
      requester: requester ? requester : {},
      metadata: metadata,
    };
  };

  await axios
    .post(apiUrl, dataGen(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((video) => {
      videoCallbackSetter(video.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default apiCreateVideoScreen;
