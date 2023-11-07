import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '../../store';

import FormButton from './FormButton';

const Form = ({ message, setVideoMessage, toggleModal }) => {
  const store = useStore();
  const messageRef = useRef(null);
  const [bufferMessage, setBufferMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setVideoMessage(messageRef.current.value);
    toggleModal();

    toast.success(
      Object.values(store.state.language.translations).length !== 0
        ? `${store.state.language.translations.recorded_screen.toast_message_added_copy}`
        : 'Message added',
    );
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBufferMessage(value);
  };

  useEffect(() => {
    /* set the message state to the buffermessage, when it's not empty */
    if (message.length !== 0) {
      setBufferMessage(message);
    }

    setTimeout(() => {
      messageRef.current.focus();
    }, 50);
  }, []);

  return (
    <form className="form" onSubmit={(e) => handleSubmit(e)}>
      <textarea
        className="input"
        type="text"
        ref={messageRef}
        value={bufferMessage}
        placeholder={
          Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.add_message_modal
                .input_description
            : 'Help us better understand the issue.'
        }
        onChange={(e) => handleChange(e)}
        rows="6"
      />
      <FormButton
        style="primary"
        role="submit"
        text={
          Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.add_message_modal.button_copy
            : 'Submit'
        }
      />
      <style jsx>{`
        .form {
          width: 100%;
          margin-top: 16px;
          max-width: ${store.state.device.platform &&
          store.state.device.platform.type === 'desktop'
            ? '425px'
            : '100%'};
          margin: 0 auto;
        }

        .input {
          width: 100%;
          resize: none;
          padding: 11px 16px;
          border: 1px solid #e5e6e6;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          margin-bottom: 16px;
        }

        .input:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .input::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }
      `}</style>
    </form>
  );
};

export default Form;
