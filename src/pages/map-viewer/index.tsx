import React, {ReactElement} from "react";
import {Vector3} from "@babylonjs/core";
import {getCameraArgs, getWorldSize} from "../../utils";
import FloorLayer from "../../components/floor-layer";
import {Box} from "../../components/box";
import HouseLayer from "../../components/house-layer";

interface MapViewerProps {

}

export interface House {
    id: string;
    show: boolean;
    width: number;
    depth: number;
    active: boolean;
    position: number[];
}

// 楼层
export interface Floor {
    id: string;
    show: boolean;
    index: number; // 楼层
    width: number;
    depth: number;
    active: boolean;
    houses: House[]
}

const floorsData: Floor[] = [{
    id: '0',
    index: 0,
    show: true,
    active: true,
    width: 1000,
    depth: 1000,
    houses: [{
        id: 'house-0',
        show: true,
        active: true,
        width: 200,
        depth: 200,
        position: [100, 0, 100]
    }]
}];

export function MapViewer(props: MapViewerProps) {
    const worldSize = getWorldSize(floorsData);
    const {alpha, beta, radius, target} = getCameraArgs(worldSize);
    const layers = getLayers(floorsData);

    return (
        <>
            <arcRotateCamera name='camera' alpha={alpha}
                             beta={beta} radius={radius}
                             target={target}/>

            <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>

            {layers}
        </>
    )
}

export function getLayers(floorsData: Floor[]): ReactElement[] {
    let results: ReactElement[] = [];

    floorsData.forEach(floor => {
        const elements: ReactElement[] = [];
        const {index: floorIndex, width, depth} = floor;

        elements.push(<FloorLayer width={width} depth={depth} position={Vector3.Zero()}/>);

        floor.houses.forEach(house => {
            const {width, depth, position} = house;
            const [x, y, z] = position;

            const boxes = [];
            for (let i = 0; i < width; i += 10) {
                for (let j = 0; j <depth; j += 10) {
                    boxes.push(<Box key={`${i}-${j}`} position={new Vector3(i, 0, j)}/>)
                }
            }

            elements.push(
                <HouseLayer width={width} height={floorIndex * 700}
                            depth={depth} position={new Vector3(x, 0, z)}>
                    {boxes}
                </HouseLayer>)
        });

        results = results.concat(elements);
    });

    return results;
}
