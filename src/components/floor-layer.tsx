import React from "react";
import {Color3, Vector3} from "@babylonjs/core";
import HouseLayer from "./house-layer";

export interface FloorProps {
    name?: string; // 楼层名称
    index?: number; // 楼层顺序，start from 0
    width: number;
    depth: number;
    position: Vector3;
}

export default function FloorLayer(props: FloorProps) {
    const {width, depth, position, name} = props;
    const {x, y, z} = position;
    const planePosition = new Vector3(x + width / 2, y, z + depth / 2);

    return (
        <transformNode
            name="floor-tnode"
            position={Vector3.Zero()}>

            <plane name="plane" width={width} height={depth}
                   position={planePosition}
                   rotation={new Vector3(Math.PI / 2, 0, 0)}
                   metadata={{type: 'floor'}}
                   isPickable={true}>
                <standardMaterial
                    name='mat'
                    alpha={0.6}
                    diffuseColor={new Color3(1, 1, 1)}
                    backFaceCulling={false}/>
            </plane>
        </transformNode>
    )
}
