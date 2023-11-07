import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../../env.config';
import { useAccountStore } from '../../../store';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import { Cookies } from 'cookies-js';
import toast from 'react-hot-toast';

const PluginConfig = () => {
  const store = useAccountStore();
  const referrerUrlRef = useRef(null);
  const [isUpdated, setUpdated] = useState(false);
  const [plugins, setPlugins] = useState(null);
  const [pluginDescription, setPluginDescription] = useState(null);
  const [pluginChosenValues, setPluginChosenValues] = useState(null);
  const query = useQueryString();

  const changePluginData = async (id, fieldName, inputType, newValue) => {
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');
    let value;
    if (inputType === 'string') {
      value = newValue;
    } else if (inputType === 'array') {
      value = newValue.split(',');
    }
    await axios.post(
      baseUrl('db/settings/app/plugins/update'),
      {
        id,
        fieldName,
        value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const changePluginSelect = (e) => {
    for (const plugin of plugins) {
      if (plugin.id === e.target.value) {
        setPluginDescription({
          id: plugin.id,
          ...plugin.description,
        });
        setPluginChosenValues({
          id: plugin.id,
          ...plugin.config,
        });
      }
    }
  };

  const updatePluginConfig = () => {
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');
    axios
      .post(
        baseUrl('db/settings/app/plugins'),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPlugins(res.data);
      });
  };
  useEffect(() => {
    updatePluginConfig();
  }, []);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const referrerUrl = referrerUrlRef.current.value;

    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    axios
      .post(
        baseUrl('db/settings/app/referrer/update'),
        {
          clientId: store.state.client.id,
          referrerUrl: referrerUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((_) => {
        setUpdated(true);
        store.setClientSettings({
          referrerUrl: referrerUrl,
        });
      })
      .catch((err) => {
        console.error(`[Error updating settings] ${err}`);
      });
  };

  return (
    <div>
      <header className="header">
        <h2 className="headline">Plugins</h2>
      </header>
      {plugins && plugins.length === 0 && (
        <div>
          <p>No plugin to show</p>
        </div>
      )}
      {plugins && plugins.length > 0 && (
        <div className="dpf cnw input__group">
          <label htmlFor="plugins" className="input__label">
            Select a plugin
          </label>
          <div className="dropdown__wrapper">
            <select
              name="plugins"
              id="plugins"
              className="dropdown"
              defaultValue
              onChange={changePluginSelect}
            >
              <option disabled value>
                -- Select a plugin
              </option>
              {plugins.map((plugin) => {
                return (
                  <option value={plugin.id} key={plugin.id}>
                    {plugin.description.displayText} ({plugin.id})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}
      {pluginDescription && (
        <div className="dpf cnw block">
          <header className="header">
            <h2 className="headline">Configure plugin</h2>
          </header>
          {Object.keys(pluginDescription.customConfiguration).length > 0 &&
            Object.keys(pluginChosenValues).length > 0 &&
            Object.keys(pluginDescription.customConfiguration)
              .sort()
              .map((key) => {
                const config = pluginDescription.customConfiguration[key];
                const current =
                  key in pluginChosenValues ? pluginChosenValues[key] : '';
                if (!config.configurable) return null;
                return (
                  <div>
                    <p>{config.displayText}</p>
                    <p className="description text">{config.description}</p>
                    {!config.configurable && <p>This value can't be changed</p>}
                    {config.help && (
                      <p className="description text">{config.help}</p>
                    )}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const [input] = e.target.children;
                        changePluginData(
                          pluginDescription.id,
                          key,
                          config.insertType,
                          input.value
                        ).then((_) => {
                          updatePluginConfig();
                          toast.success('Plugin configuration updated');
                        });
                      }}
                      className="dpf cnw form"
                    >
                      <input
                        type="text"
                        defaultValue={current}
                        key={current}
                        disabled={!config.configurable}
                        className="input__text"
                        placeholder="Your data field"
                      ></input>
                      <button
                        role="submit"
                        className="dpif aic jcc button"
                        disabled={!config.configurable}
                      >
                        Update
                      </button>
                    </form>
                  </div>
                );
              })}
        </div>
      )}
      <style jsx>{`
        .header {
          margin-bottom: 16px;
        }

        .headline {
          font-size: 22px;
          font-weight: 500;
        }

        .form {
          width: 100%;

          position: relative;
        }

        .input__group {
          width: 100%;
        }

        .input__group + .input__group {
          margin-top: 32px;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
          color: #0b0b0b;
        }

        .description {
          margin: 4px 0 8px;
        }
        .text {
          color: #a1a1a1;
          font-size: 14px;
          line-height: 22px;
        }
        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: transparent;
          border: 1px solid #e5e6e6;
          transition: all ease-in-out 0.15s;
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

        .input__text:-webkit-autofill {
          box-shadow: 0 0 0 30px white inset;
          border: 1px solid #e5e6e6;
          -webkit-text-fill-color: #0b0b0b;
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .dropdown__wrapper {
          position: relative;
          margin-top: 8px;
        }

        .dropdown__wrapper::after {
          content: '';
          position: absolute;
          top: calc(50% - 6px);
          right: 24px;
          display: inline-block;
          transform: rotate(45deg);
          border-style: solid;
          border-width: 6px 6px 0 0;
          border-color: transparent #8614f8 transparent transparent;
        }

        .dropdown {
          padding: 11px 32px 8px 16px;
          border-radius: 5px;
          width: 100%;
          height: 47px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          border: 1px solid #e5e6e6;
          font-family: inherit;
          appearance: none;
          cursor: pointer;
          text-overflow: ellipsis;
        }

        .dropdown:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .block {
          margin-top: 24px;
          width: 100%;
        }

        .button {
          align-self: flex-start;
          padding: 16px 24px 14px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: white;
          background: #8614f8;
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
          cursor: pointer;
          user-select: none;
          margin: 8px 0 0;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
        }

        .button:hover {
          color: white;
          background: #6606c6;
        }

        .button:disabled {
          background: #009900;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PluginConfig;
