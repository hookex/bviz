

import * as Babylon from '@babylonjs/core';
import { Globals, FrameLoop, update } from '@react-spring/core';
// import {} from 'react-babylonjs';

// Extend animated with all the available Babylon elements
// const apply = merge(animated);
// const extendedAnimated = apply(Babylon);

Globals.assign({
    defaultElement: 'transformNode',
    applyAnimatedValues: (node, props) => {
        console.log('applyAnimatedValues', node, props);
    },
    // createStringInterpolator,
    // colorNames,
})

export * from './animated';
export * from '@react-spring/core';


interface AnimatedGlobals {
    // Defaults to `Date.now`
    now?: () => number
    // To support colors like "red". Defaults to `{}`
    colorNames?: { [key: string]: number }
    // Usually the "div" of the platform. Defaults to `undefined`
    defaultElement?: any
    // Update the values of the affected nodes. Required
    applyAnimatedValues?: (node: any, props: object) => boolean | void
    // Wrap the `transform` property of an animated style
    createAnimatedTransform?: (transform: any) => any
    // Wrap the `style` property of an animated component
    createAnimatedStyle?: (style: any) => any
    // Create the `ref` API of an animated component
    createAnimatedRef?: (
        node: { current: any },
        mounted?: { current: boolean },
        forceUpdate?: () => void
    ) => { current: any }
    // Defaults to `window.requestAnimationFrame`
    requestAnimationFrame?: (onFrame: () => void) => number
    // Defaults to `window.cancelAnimationFrame`
    cancelAnimationFrame?: (handle: number) => void
    // Called on every frame. Defaults to `undefined`
    manualFrameloop?: () => void
    // Custom string interpolation. Defaults to `undefined`
    interpolation?: (config: object) => (input: number) => number | string
}
