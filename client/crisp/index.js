import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import CrispApp from './CrispApp';

const container = document.querySelector('#root');

const root = ReactDOMClient.createRoot(container);

root.render(<CrispApp />);
