import './App.css';

import React from "react";
import Map from "./MapComponents/Map";
import Side from "./MapComponents/sideBar"
import {useProSidebar} from "react-pro-sidebar";

function App() {

    return (
        <div className="App">
            <div className="header">
                <h1>Quake Text</h1>
            </div>
            <div className="map">
                <Map/>
            </div>

        </div>
    );
}

export default App;