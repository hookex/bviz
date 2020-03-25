import {Globals} from '@react-spring/core';
import {createStringInterpolator} from '@react-spring/shared/stringInterpolation';
import {applyInitialPropsToInstance} from "../react-babylonjs/UpdateInstance";
import {Vector3, Color3, Color4} from '@babylonjs/core';

import {
    CustomPropsHandler,
    ICustomPropsHandler,
    PropChangeType,
    PropertyUpdateProcessResult
} from '../react-babylonjs/PropsHandler';

function parseRgbaString(rgba: string): number[] {
    const arr: string[] = rgba.replace(/[^\d,]/g, '').split(',');
    return arr.map(num => parseInt(num, 10) / 255);
}

class CustomColor3StringHandler implements ICustomPropsHandler<string, Color3> {
    public propChangeType: string = PropChangeType.Color3;

    accept(newProp: string): boolean {
        return typeof (newProp) === 'string';
    }

    process(oldProp: string, newProp: string): PropertyUpdateProcessResult<Color3> {
        if (oldProp !== newProp) {
            return {
                processed: true,
                value: Color3.FromArray(parseRgbaString(newProp))
            };
        }

        return {processed: false, value: null};
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

        for (let i = 0; i < oldProp.length; i++) {
            if (oldProp[i] !== newProp[i]) {
                // console.log('found diff value Color3Array')
                return {
                    processed: true,
                    value: Color3.FromArray(newProp)
                };
            }
        }

        return {processed: false, value: null};
    }
}

class CustomColor4StringHandler implements ICustomPropsHandler<string, Color4> {
    public propChangeType: string = PropChangeType.Color4;

    accept(newProp: string): boolean {
        return typeof (newProp) === 'string';
    }

    process(oldProp: string, newProp: string): PropertyUpdateProcessResult<Color4> {
        if (oldProp !== newProp) {
            // console.log('found diff Color4String')
            return {
                processed: true,
                value: Color4.FromArray(parseRgbaString(newProp))
            };
        }

        return {processed: false, value: null};
    }
}


class CustomVector3ArrayHandler implements ICustomPropsHandler<number[], Vector3> {
    public propChangeType: string = PropChangeType.Vector3;

    accept(newProp: []): boolean {
        return Array.isArray(newProp);
    }

    process(oldProp: number[], newProp: number[]): PropertyUpdateProcessResult<Vector3> {
        if (oldProp === undefined || oldProp.length !== newProp.length) {
            // console.log(`found diff length (${oldProp?.length}/${newProp?.length}) Color3Array new? ${oldProp === undefined}`)
            return {
                processed: true,
                value: Vector3.FromArray(newProp)
            };
        }

        for (let i = 0; i < oldProp.length; i++) {
            if (oldProp[i] !== newProp[i]) {
                return {
                    processed: true,
                    value: Vector3.FromArray(newProp)
                };
            }
        }

        return {processed: false, value: null};
    }
}

CustomPropsHandler.RegisterPropsHandler(new CustomColor3StringHandler());
CustomPropsHandler.RegisterPropsHandler(new CustomColor3ArrayHandler());
CustomPropsHandler.RegisterPropsHandler(new CustomColor4StringHandler());
CustomPropsHandler.RegisterPropsHandler(new CustomVector3ArrayHandler());


Globals.assign({
    defaultElement: 'sphere',
    applyAnimatedValues: (node, props) => {
        /**
         * used for update props
         * initialization don't enter here
         */
        applyInitialPropsToInstance(node, props)
    },
    createStringInterpolator,
});

export * from './animated';
export * from '@react-spring/core';


