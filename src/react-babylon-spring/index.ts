import {Globals} from '@react-spring/core';
import {createStringInterpolator} from '@react-spring/shared/stringInterpolation';
import {applyInitialPropsToInstance, applyProps} from "../react-babylonjs/UpdateInstance";

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
        /**
         * used for update props
         * initialization don't enter here
         */
        applyProps(node, props)
    },
    createStringInterpolator,
    // createAnimatedInterpolation: (...args: [any, any]) => {
    //     console.log('args', args);
    //     deprecateInterpolate()
    //     return to(...args)
    // },
    // colorNames,
});

export * from './animated';
export * from '@react-spring/core';


