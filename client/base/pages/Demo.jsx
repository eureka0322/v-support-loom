import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'cookies-js';

import { theme } from '../../theme.config';

export default function Demo() {
  const workspaceInputRef = useRef(null);
  const webpageUrlRef = useRef(null);
  const [workspaceId, setWorkspaceId] = useState(
    Cookies.get('videosupport-io-demo-id') !== undefined
      ? Cookies.get('videosupport-io-demo-id')
      : ''
  );
  const [webpageUrl, setwebpageUrl] = useState(null);

  const setId = (id) => {
    Cookies.set('videosupport-io-demo-id', id, {
      expires: 60 * 60,
    }); // should expire after 1 hour

    setWorkspaceId(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const workspaceInputId = workspaceInputRef.current.value;
    const webpageUrl = webpageUrlRef.current.value;
    setId(workspaceInputId);
    setwebpageUrl(webpageUrl);
  };

  const insertScript = () => {
    /*
    const scriptSettings = document.createElement('script');
    scriptSettings.innerHTML = `
    window.$crisp=[];window.CRISP_WEBSITE_ID="bf71e003-9600-4f97-a2ee-9803ca6e384f";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
    `;
    const existingScript = document.getElementsByTagName('script')[0];
    existingScript.parentNode.insertBefore(scriptSettings, existingScript);
    */
    const scriptSettings = document.createElement('script');
    scriptSettings.innerHTML = `window.intercomSettings = {
      app_id: '${workspaceId}',
      name: 'Francis',
      email: 'francis@videosupport.io',
      phone: '+32477174562',
      customer_support: true,
      postal_code: 9000,
      other_misc_information: 'hello',
    };`;
    const existingScript = document.getElementsByTagName('script')[0];
    existingScript.parentNode.insertBefore(scriptSettings, existingScript);

    const scriptIntercom = document.createElement('script');
    scriptIntercom.innerHTML = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/md42xyrr';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`;
    existingScript.parentNode.insertBefore(scriptIntercom, existingScript);
  };

  useEffect(() => {
    insertScript();
  }, [workspaceId]);

  return (
    <div className="home">
      {!workspaceId && !webpageUrl && (
        <div className="content__wrapper">
          <form className="form" onSubmit={handleSubmit}>
            <div className="dpf cnw input__group">
              <label htmlFor="identifier" className="input__label">
                Identifier
              </label>
              <input
                ref={workspaceInputRef}
                type="text"
                className="input__text"
                id="identifier"
                placeholder="Workspace identifier"
              />
            </div>
            <div className="dpf cnw input__group">
              <label htmlFor="webpage" className="input__label">
                Webpage
              </label>
              <input
                ref={webpageUrlRef}
                type="text"
                className="input__text"
                id="webpage"
                placeholder="Webpage Url"
              />
            </div>
            <button className={`button`} role="submit">
              Submit
            </button>
          </form>
        </div>
      )}
      <style jsx>{`
        body {
          overflow-y: hidden;
        }
        .home {
          width: 100%;
          height: 100%;
          background: url(${webpageUrl ? webpageUrl : '/assets/demo/dummy.jpg'})
            top left / cover no-repeat;
        }
        .content__wrapper {
          width: 100%;
          max-width: 425px;
          padding: 24px;
          margin-bottom: 32px;
        }
        .form {
          width: 100%;
          padding: 24px;
          background: white;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.2);
          border-radius: 5px;
        }
        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
        }
        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border: 1px solid #e5e6e6;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          margin-bottom: 16px;
        }
        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }
        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }
        .button {
          width: 100%;
          padding: 22px 24px 20px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: ${theme.button_primary_modal_text};
          background: ${theme.button_primary_modal_background};
          box-shadow: ${theme.button_primary_modal_boxshadow};
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }
      `}</style>
    </div>
  );
}
