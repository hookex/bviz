import React from 'react';
import {Vector3} from "@babylonjs/core";
import Spring, {SpringWithDom} from "./pages/spring";
import './App.css';
import {MapViewer} from "./pages/map-viewer";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/*<MapViewer/>*/}
                <Spring/>
                {/*<SpringWithDom/>*/}
            </header>
        </div>
    );
}

export default App;

