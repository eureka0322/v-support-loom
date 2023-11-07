import axios from 'axios';
import { baseUrl } from '../../env.config';

export const runHooks = async (linkId, videoRefId) => {
  const res = await axios.get(baseUrl('api/hooks/run'), {
    params: {
      linkId: linkId,
      videoRefId: videoRefId,
    },
  });
  return res;
};
