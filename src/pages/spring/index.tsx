import {Vector3} from "@babylonjs/core";
import React, {useEffect, useState} from "react";
import {useSpring,  a}  from '../../react-babylon-spring';
import Engine from "../../react-babylonjs/Engine";
import Scene from "../../react-babylonjs/Scene";

export default function WithSpring() {
    const props:any = useSpring({x: 0, from: {x: -3}});
    console.log('props', props)

    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <a.sphere name='sphere1' diameter={2} segments={16} position={new Vector3(props.x as number, 1, 0)}/>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </Scene>
        </Engine>
    )
}

// const sphereProps = useSpring({
//     position: new Vector3(0, 1, 0),
// }, {
//     from: {
//         position: new Vector3(-4, 1, 0),
//     }
// });
// export function useSpring(defaultProps: any, config: {from: any}) {
//     const [props, setProps] = useState(defaultProps);
//
//     const {position} = props;
//     const {toPosition} = config.from;
//
//     const animate = (_: any) => {
//         if (position) {
//             const velocity = 0.005;
//             position.x += velocity;
//             const now = Date.now()
//             props.position = position.clone();
//             setProps(props);
//             timer = requestAnimationFrame(animate);
//         }
//     };
//
//     let timer: number;
//     useEffect(() => {
//         timer = requestAnimationFrame(animate);
//         return () => cancelAnimationFrame(timer);
//     }, []);
// }
