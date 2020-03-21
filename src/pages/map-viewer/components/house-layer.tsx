import * as React from 'react';
import {ReactElement, useEffect, useRef} from 'react';

import {Animation, Color3, Matrix, Vector3} from '@babylonjs/core';
import {useBabylonScene} from "react-babylonjs";

export interface HouseProps {
    width: number;
    depth: number;
    height: number;
    position: Vector3;

    borderColor?: string;
    gridWidth?: number;
    color: string;
    opacity?: number;
    children?: ReactElement[];
    animation?: boolean;
}

HouseLayer.defaultProps = {
    transparent: true,
    opacity: 0.7,
    // color: '#27215F',
    color: '#27215F',
    borderColor: '#312A74',
    width: 100,
    height: 8,
    depth: 100,
    x: 0,
    y: 0,
    z: 0,
    animation: true,
};

export default function HouseLayer(props: HouseProps) {
    const {color, opacity, children, position, width, height, depth} = props;
    const scene = useBabylonScene();

    let {x, y, z} = position;

    const pivotAt = new Vector3(-width / 2, -height / 2, -depth / 2);
    const pivotMatrix = Matrix.Translation(-pivotAt.x, -pivotAt.y, -pivotAt.z);

    const offsetY = 100;

    const animations = getSlideUpAnimation(position, offsetY);

    const tNode = useRef<any>(null);

    useEffect(() => {
        if (tNode.current && scene) {
            const group = tNode.current.hostInstance as any;
            scene.beginDirectAnimation(group, animations, 0, 60);
        }
    }, []);

    return (
        <transformNode name='house-group'
                       ref={tNode}
                       position={position}>

            <box name="area" width={width} height={height} depth={depth}
                 position={new Vector3(0, 0, 0)}
                 isPickable={true}
                 updatable={true}
                 setPivotMatrix={[pivotMatrix, false]}>

                <standardMaterial name="area-material" diffuseColor={Color3.FromHexString(color)}
                                  alpha={opacity} backFaceCulling={true}/>

            </box>

            {children}
        </transformNode>
    )
}

export function getSlideUpAnimation(position: Vector3, offsetY: number): Animation[] {
    const {x, y, z} = position;

    const keys = [];

    keys.push({
        frame: 0,
        value: y - offsetY,
    });

    keys.push({
        frame: 30,
        value: y - offsetY,
    });

    keys.push({
        frame: 60,
        value: y
    });

    const animation = new Animation('slide-animation', 'position.x', 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    animation.setKeys(keys);

    return [animation];
}
