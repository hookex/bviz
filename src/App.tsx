import React from 'react';
import {Vector3} from "@babylonjs/core";
import WithSpring from "./pages/spring";
import SpringWithDom from './pages/spring/with-dom';
import './App.css';
import {MapViewer} from "./pages/map-viewer";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/*<MapViewer/>*/}
                <WithSpring/>
                {/*<SpringWithDom/>*/}
            </header>
        </div>
    );
}

export default App;
/*
AnimatedProps {children: Set(0), source: {…}, payload: Set(1), Symbol(isAnimated): true, update: ƒ}
children: Set(0) {}
source: {style: AnimatedStyle, children: "I will fade in"}
payload: Set(1) {AnimatedValue}
update: () => {…}
arguments: (...)
caller: (...)
length: 0
name: ""
__proto__: ƒ ()
    [[FunctionLocation]]: withAnimated.tsx:29
    [[Scopes]]: Scopes[4]
Symbol(isAnimated): true
__proto__: AnimatedObject


animated {opacity: AnimatedValue}
AnimatedObject.ts:12 payload Set(1) {AnimatedValue}

animated {name: "sphere1", diameter: 2, segments: 16, position: Vector3}name: "sphere1"diameter: 2segments: 16position: Vector3 {x: AnimatedValue, y: 1, z: 0}__proto__: Object
AnimatedObject.ts:12 payload Set(0) {}
 */
