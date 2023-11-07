import React from 'react';

import Close from './Close';
import ActionButton from '../../../shared/components/button/ActionButton';

const RecordingInterfaceSettings = ({
  headline,
  handleSettingsMenu,
  handWritingSide,
  setHandWritingSide,
  handleRecordAudioToggle,
  handleRecordVideoToggle,
  isRecordingAudio,
  isRecordingVideo,
  isOnDesktop,

}) => {

  return (
    <div className="cnw aic slide-up">
      <div className="background" />
      <div className="button-wrapper-top">
        <Close onClick={() => handleSettingsMenu(false)} style="primary" />
      </div>
      <section className="slide-up-interface">
        <div className="cnw vsio-ui-container slide-up-content">
          <header className="cnw aic header">
            <h1 className="headline">{headline}</h1>
          </header>
          <div className="cnw slide-up-content-group">
            <div className="subheadline">Personalisation</div>
            <div className="description">
              Customise the interface based on your preferences
            </div>
            <div className="rnw jcsb buttons">
              <div className="button-wrapper button--half">
                <ActionButton
                  style={'secondary'}
                  stretch
                  label={isOnDesktop ? 'Camera left' : 'Left-handed'}
                  type="lg"
                  active={handWritingSide === 'left' ? true : false}
                  onClick={() => setHandWritingSide('left')}
                />
              </div>
              <div className="button-wrapper button--half">
                <ActionButton
                  style={'secondary'}
                  stretch
                  label={isOnDesktop ? 'Camera right' : 'Right-handed'}
                  type="lg"
                  active={handWritingSide === 'right' ? true : false}
                  onClick={() => setHandWritingSide('right')}
                />
              </div>
            </div>
            <br />
            {isOnDesktop && (
              <>
                <div className="subheadline">Screen Recording</div>
                <div className="description">
                  Options for screen recorder
                </div>
                <div className="rnw jcsb buttons">
                  <div className="button-wrapper button--half">
                    <ActionButton
                      style={'secondary'}
                      stretch
                      label={isRecordingAudio ? 'Audio Enabled' : 'Audio Disabled'}
                      type="lg"
                      active={isRecordingAudio}
                      onClick={handleRecordAudioToggle}
                    />
                  </div>

                  <div className="button-wrapper button--half">
                    <ActionButton
                      style={'secondary'}
                      stretch
                      label={isRecordingVideo ? 'Camera Enabled' : 'Camera Disabled'}
                      type="lg"
                      active={isRecordingVideo}
                      onClick={handleRecordVideoToggle}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="vsio-ui-container button-wrapper--save">
          <ActionButton
            style={'primary'}
            stretch
            label={'Save'}
            type="lg"
            onClick={() => handleSettingsMenu(false)}
          />
        </div>
      </section>
      <style jsx>{`
        .slide-up {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
        }

        .background {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(11, 11, 11, 0.2);
          z-index: 0;
        }

        .button-wrapper-top {
          position: relative;
          z-index: 1;
        }

        .header {
          width: 100%;
        }

        .headline {
          font-size: var(--fs-xl);
          font-weight: 500;
        }

        .slide-up-interface {
          position: relative;
          width: 100%;
        }
      
      
        .slide-up {
          position: absolute;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
        }

        .background {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(11, 11, 11, 0.2);
          z-index: 0;
        }

        .button-wrapper-top {
          position: relative;
          z-index: 1;
        }

        .header {
          width: 100%;
        }

        .headline {
          font-size: var(--fs-xl);
          font-weight: 500;
        }

        .slide-up-interface {
          position: relative;
          width: 100%;
          background: var(--white);
          box-shadow: 0 -3px 1px 0 rgba(0, 0, 0, 0.2);
          border-radius: 12px 12px 0 0;
          padding: 16px;
          z-index: 1;
        }

        .slide-up-content {
          position: relative;
          margin-top: 32px;
          margin-bottom: 16px;
          padding: 0;
        }

        .slide-up-content::before {
          content: '';
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 5px;
          background: #dbdbdb;
          border-radius: 3px;
        }

        .slide-up-content-group {
          margin-top: 24px;
          margin-bottom: 8px;
        }

        .subheadline {
          font-size: var(--fs-lg);
          font-weight: 500;
        }

        .description {
          width: 100%;
          max-width: 75%;
          color: var(--dark-gray);
          line-height: 24px;
        }

        .buttons {
          margin-top: 8px;
        }

        .button-wrapper {
          width: 100%;
        }
        .button--half {
          max-width: 49%;
        }

        .button-wrapper--save {
          padding: 0;
        }
      
      `}

      </style>
    </div>
  );
};

export default RecordingInterfaceSettings;
