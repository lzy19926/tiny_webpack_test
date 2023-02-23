import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatGPT from './ChatGPT/chatGPT.jsx'
import './index.css'


function App() {
    return (
        <ChatGPT />
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);