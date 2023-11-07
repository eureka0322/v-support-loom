import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './VideosupportApp';

const container = document.querySelector('#root');

const root = ReactDOMClient.createRoot(container);

root.render(<App />);
