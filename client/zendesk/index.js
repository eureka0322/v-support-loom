import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import ZendeskApp from './ZendeskApp';

const container = document.querySelector('#root');

const root = ReactDOMClient.createRoot(container);

root.render(<ZendeskApp />);
