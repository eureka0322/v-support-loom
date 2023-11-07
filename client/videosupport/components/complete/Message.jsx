import React from 'react';

import PoweredBy from '../misc/PoweredBy';
import Form from './Form';

import { useStore } from '../../store';

const Message = ({ toggleModal, message, setVideoMessage }) => {
  const store = useStore();
  return (
    <div className="modal">
      <button onClick={() => toggleModal()} className="dpf jcc aic close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0b0b0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="x-icon"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <section className="dpf cnw aic content">
        <header className="header">
          <h1 className="headline">
            {Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.add_message_modal.title
              : 'Add a message'}
          </h1>
        </header>
        <p className="description text">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.add_message_modal.description
            : 'Leave us a message & we take care of the rest.'}
        </p>

        <Form
          message={message}
          setVideoMessage={setVideoMessage}
          toggleModal={toggleModal}
        />

        <div className="poweredby_wrapper">
          <PoweredBy display="horizontal" version="dark" />
        </div>
      </section>
      <div className="background"></div>
      <style jsx>{`
        .modal {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 2;
        }
        .close {
          position: absolute;
          top: calc(-70px - 16px);
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: white;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.2);
        }

        .content {
          width: 100%;
          margin: 0 auto;
          background: white;
          padding: 40px 16px 16px;
          background: #ffffff;
          box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.1);
          border-radius: 10px 10px 0 0;
        }
        .headline {
          font-size: 28px;
          font-weight: 700;
          color: ${store.state.app.branding.primaryColour};
        }

        .description {
          margin-top: 4px;
          max-width: 343px;
        }

        .text {
          font-size: 18px;
          line-height: 28px;
          color: #a1a1a1;
          text-align: center;
        }

        .poweredby_wrapper {
          width: 100%;
          margin-top: 16px;
        }

        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

export default Message;
