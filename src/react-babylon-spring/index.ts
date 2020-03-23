import * as Babylon from '@babylonjs/core';
import { Globals, FrameLoop, update } from '@react-spring/core';
import { createStringInterpolator } from '@react-spring/shared/stringInterpolation';
import {applyInitialPropsToInstance, applyUpdateToInstance} from "../react-babylonjs/UpdateInstance";
import {deprecateInterpolate} from "@react-spring/shared/deprecations";
import {createAnimatedInterpolation as to} from "@react-spring/shared/globals";

// import {} from 'react-babylonjs';

// Extend animated with all the available Babylon elements
// const apply = merge(animated);
// const extendedAnimated = apply(Babylon);

function addEffect() {
    console.log('addEffect');
}

Globals.assign({
    defaultElement: 'sphere',
    // frameLoop: addEffect && new FrameLoop({
    //     update: () => {
    //         console.log('update')
    //         return true;
    //     },
    //     onFrame: () => {
    //         console.log('onframe')
    //     },
    //     requestFrame: () => {
    //         console.log('requestframe')
    //     }
    // }),
    applyAnimatedValues: (node, props) => {
        console.log('applyAnimatedValue', node, props)
        applyInitialPropsToInstance(node, props)
    },
    createStringInterpolator,
    createAnimatedInterpolation: (...args: [any, any]) => {
        console.log('args', args);
        deprecateInterpolate()
        return to(...args)
    },
    getComponentProps(props: any) {
        console.log('getComProps', props);
        return props;
    }

    // colorNames,
});

export * from './animated';
export * from '@react-spring/core';

