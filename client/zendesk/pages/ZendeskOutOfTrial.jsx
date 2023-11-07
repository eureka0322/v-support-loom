import loadjs from 'loadjs';
import React, { useEffect, useState } from 'react';

import OutOfBusiness from '../../hsframe/pages/OutOfBusiness';

const ZendeskOutOfTrial = () => {
  useEffect(() => {
    loadjs(
      [
        'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js',
      ],
      'zendesk'
    );

    loadjs.ready('zendesk', {
      success: () => {
        const client = ZAFClient.init();
        client.invoke('resize', {
          width: '300px',
          height: '400px',
        });
      },
      error: (err) => {
        console.error('[loadjs] error', err);
      },
    });
  }, []);

  return (
    <OutOfBusiness
      title={'Trial expired'}
      description={
        'Unfortunately, your trial has expired. Contact us for more information'
      }
    />
  );
};

export default ZendeskOutOfTrial;
