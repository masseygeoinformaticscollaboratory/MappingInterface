import React from 'react';
import './index.css';
import App from './App';
import {createRoot} from 'react-dom/client';
import {ProSidebarProvider} from "react-pro-sidebar";

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <ProSidebarProvider>
        <App tab="home"/>
    </ProSidebarProvider>
);