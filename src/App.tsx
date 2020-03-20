import React from 'react';
import {Scene, Engine} from 'react-babylonjs';
import logo from './logo.svg';
import './App.css';
import {Vector3} from "@babylonjs/core";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS' >
          <Scene>
            <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]} />
            <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
            <sphere name='sphere1' diameter={2} segments={16} position={new Vector3(0, 1, 0)} />
            <ground name='ground1' width={6} height={6} subdivisions={2} />
          </Scene>
        </Engine>
      </header>
    </div>
  );
}

export default App;
