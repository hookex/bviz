import React from "react";
import {Matrix, Vector3} from "@babylonjs/core";

export interface BoxProps {
    position: Vector3;
}

export function Box(props: BoxProps) {
    const {position} = props;

    const width = 6;
    const height = 16;
    const depth = 6;

    const pivotAt = new Vector3(-width / 2, -height / 2, -depth / 2);
    const pivotMatrix = Matrix.Translation(-pivotAt.x, -pivotAt.y, -pivotAt.z);

    return (
        <box name='box' position={position}
             width={width} height={height} depth={depth}
             setPivotMatrix={[pivotMatrix, false]}/>
    )
}
