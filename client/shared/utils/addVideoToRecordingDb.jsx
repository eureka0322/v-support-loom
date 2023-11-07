import axios from 'axios';
import { baseUrl } from '../../env.config';

export const addVideoToRecordingDb = async (
  recordingId,
  linkId,
  clientId,
  customerId,
  recording,
  device
) => {
  return await axios({
    method: 'POST',
    url: baseUrl('db/recording/add'),
    data: {
      linkId: linkId,
      clientId: clientId,
      customerId: customerId,
      recordingId: recordingId,
      recording: recording,
      device: device,
    },
  });
};
