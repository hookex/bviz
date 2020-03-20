import React from 'react';
import {Engine, Scene} from 'react-babylonjs';
import './App.css';
import {Vector3} from "@babylonjs/core";
import FloorLayer from "./components/floor-layer";
import {getCameraArgs, getWorldSize} from "./utils";
import {MapViewer} from "./pages/map-viewer";

function App() {

    return (
        <div className="App">
            <header className="App-header">
                <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
                    <Scene>
                        <MapViewer/>
                        <sphere name='sphere1' diameter={2} segments={16} position={new Vector3(0, 1, 0)}/>
                        <ground name='ground1' width={6} height={6} subdivisions={2}/>
                    </Scene>
                </Engine>
            </header>
        </div>
    );
}

export default App;

