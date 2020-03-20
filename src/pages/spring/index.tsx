import {Vector3} from "@babylonjs/core";
import {Engine, Scene} from 'react-babylonjs';
import {animated, useSpring} from 'react-spring'
import React from "react";

export default function Spring() {
    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <sphere name='sphere1' diameter={2} segments={16} position={new Vector3(0, 1, 0)}/>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </Scene>
        </Engine>
    )
}

export function SpringWithDom() {
    const props = useSpring({opacity: 1, from: {opacity: 0}});
    return <animated.div style={props}>I will fade in</animated.div>
}
