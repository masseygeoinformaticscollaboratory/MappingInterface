import './App.css';

import React from "react";
import Map from "./MapComponents/Map";
import Side from "./MapComponents/sideBar"
function App() {

    return (
        <div id="app">
            <div className="header">
                <h1>Quake Text</h1>
            </div>
            <main style={({display: "flex"})}>
                <Side/>
                <Map/>
            </main>
        </div>
    );
}

export default App;