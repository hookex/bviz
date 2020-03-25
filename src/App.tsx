import React from 'react';
import {Vector3, Color3, Color4} from "@babylonjs/core";
import WithSpring, { WithSpringColor, WithSpringScaling} from "./pages/spring";
import SpringWithDom from './pages/spring/with-dom';
import './App.css';
import {MapViewer} from "./pages/map-viewer";
import {WithSpringVector3} from "./pages/spring";
import { ICustomPropsHandler, PropChangeType, PropertyUpdateProcessResult, CustomPropsHandler } from './react-babylonjs/PropsHandler';

function parseRgbaString(rgba: string): number[] {
    const arr:string[] = rgba.replace(/[^\d,]/g, '').split(',');
    return arr.map(num => parseInt(num, 10) / 255);
  };

class CustomColor3StringHandler implements ICustomPropsHandler<string, Color3> {
    public propChangeType: string = PropChangeType.Color3;
    accept(newProp: string): boolean {
        return typeof(newProp) === 'string';
    }
    process(oldProp: string, newProp: string): PropertyUpdateProcessResult<Color3> {
        if (oldProp !== newProp) {
            return {
                processed: true,
                value: Color3.FromArray(parseRgbaString(newProp))
            };
        }

        return { processed: false, value: null};
    }
}

class CustomColor3ArrayHandler implements ICustomPropsHandler<number[], Color3> {
    public propChangeType: string = PropChangeType.Color3;
    accept(newProp: []): boolean {
        return Array.isArray(newProp);
    }
    process(oldProp: number[], newProp: number[]): PropertyUpdateProcessResult<Color3> {
        if (oldProp === undefined || oldProp.length !== newProp.length) {
            // console.log(`found diff length (${oldProp?.length}/${newProp?.length}) Color3Array new? ${oldProp === undefined}`)
            return {
                processed: true,
                value: Color3.FromArray(newProp)
            };
        }

        for(let i = 0; i< oldProp.length; i++) {
            if (oldProp[i] !== newProp[i]) {
                // console.log('found diff value Color3Array')
                return {
                    processed: true,
                    value: Color3.FromArray(newProp)
                };
            }
        }

        return { processed: false, value: null};
    }
}

class CustomColor4StringHandler implements ICustomPropsHandler<string, Color4> {
    public propChangeType: string = PropChangeType.Color4;
    accept(newProp: string): boolean {
        return typeof(newProp) === 'string';
    }
    process(oldProp: string, newProp: string): PropertyUpdateProcessResult<Color4> {
        if (oldProp !== newProp) {
            // console.log('found diff Color4String')
            return {
                processed: true,
                value: Color4.FromArray(parseRgbaString(newProp))
            };
        }

        return { processed: false, value: null};
    }
}

CustomPropsHandler.RegisterPropsHandler(new CustomColor3StringHandler());
CustomPropsHandler.RegisterPropsHandler(new CustomColor3ArrayHandler());
CustomPropsHandler.RegisterPropsHandler(new CustomColor4StringHandler());

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/*<MapViewer/>*/}
                {/* <WithSpring/> */}
                <WithSpringColor />
                {/* <WithSpringVector3/> */}
                {/*<SpringWithDom/>*/}
                {/*<WithSpringScaling/>*/}
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


collectViews up AnimatedValue {children: Set(1), views: Set(0), done: false, value: 0, payload: Set(1), …} Set(0) {}
AnimatedArray.ts:8 collectViews inner AnimatedValue {children: Set(1), views: Set(0), done: false, value: 0, payload: Set(1), …} Set(0) {} undefined
AnimatedArray.ts:8 collectViews inner AnimatedStyle {children: Set(1), source: {…}, payload: Set(1), Symbol(isAnimated): true} Set(0) {} undefined
AnimatedArray.ts:8 collectViews inner AnimatedProps {children: Set(0), source: {…}, payload: Set(1), Symbol(isAnimated): true, update: ƒ} Set(0) {} () => {
    console.log('node', node);
    if (!node.current) return;
    const didUpdate = Object(_react_spring_shared_globals__WEBPACK_IMPORTED_MODULE_2__["applyAnimatedValues"])(node.current, next…
AnimatedValue.ts:46 collectViews down AnimatedValue {children: Set(1), views: Set(1), done: false, value: 0, payload: Set(1), …} Set(1) {AnimatedProps}
 */
