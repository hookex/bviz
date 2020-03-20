import {Vector3} from "@babylonjs/core";
import {Floor} from "../pages/map-viewer";

export function getCameraArgs(worldSize: Vector3) {
    const {x: width, y: height, z: depth} = worldSize;

    return {
        alpha: 3 * Math.PI / 2,
        beta: Math.PI / 4,
        radius: Math.sqrt(width * width + height * height + depth * depth),
        target: new Vector3(width / 2, 0, depth / 2),
    }
}

export function getWorldSize(floors: Floor[]): Vector3 {
    let maxWidth = 0;
    let maxLength = 0;

    floors.forEach((floor) => {
        {
            const {width, depth} = floor;
            maxWidth =  width> maxWidth ? width : maxWidth;
            maxLength = depth > maxLength ? depth : maxLength;
        }

        floor.houses.forEach(house => {
            const {width, depth, position} = house;

            const  tempWidth = house.width + house.position[0];
            const tempDepth = house.depth + house.position[2];

            maxWidth =  tempWidth> maxWidth ? tempWidth : maxWidth;
            maxLength = tempDepth > maxLength ? tempDepth : maxLength;
        });
    });

    return new Vector3(maxWidth, maxLength, floors.length * 700);
}
