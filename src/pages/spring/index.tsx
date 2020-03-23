import {Vector3} from "@babylonjs/core";
import React from "react";
import {a, useSpring} from '../../react-babylon-spring';
import Engine from "../../react-babylonjs/Engine";
import Scene from "../../react-babylonjs/Scene";

export default function WithSpring() {
    const cameraProps = useSpring({
        radius: 10,
        from: {
            radius: 30
        }
    });

    const lightProps: any = useSpring({intensity: 0.7, from: {intensity: 0.1}});
    const sphereProps: any = useSpring({
        position: [0, 1, 0],
        from: {
            position: [-3, 1, 0]
        }
    });
    const colorProps = useSpring({
        color: [1, 1, 1, 1],
        from: {
            color: [0, 0, 1, 1]
        }
    });

    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <a.arcRotateCamera name='camera1' alpha={Math.PI/2} beta={Math.PI/4} radius={cameraProps.radius} target={Vector3.Zero()}/>
                <a.hemisphericLight name='light1' intensity={lightProps.intensity} direction={Vector3.Up()}/>
                <a.sphere name='sphere1' diameter={3} segments={16} position={sphereProps.position}>
                    <a.standardMaterial name='material' diffuseColor={colorProps.color}/>
                </a.sphere>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </Scene>
        </Engine>
    )
}

export function WithSpringVector3() {
    const sphereProps: any = useSpring({
        position: new Vector3(0, 1, 0),
        from: {
            position: new Vector3(-3, 1, 0),
        }
    });

    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <a.sphere name='sphere1' diameter={3} segments={16} position={sphereProps.position}/>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </Scene>
        </Engine>
    )
}

export function WithSpringColor() {
    const colorProps = useSpring({
        color: [1, 1, 1, 1],
        from: {
            color: [0, 0, 1, 1]
        }
    });

    // const colorProps = useSpring({
    //     color: '#000000',
    //     from: {
    //         color: '#ffffff',
    //     }
    // });
    // const colorProps = useSpring({
    //     color: 'rgba(0, 0, 0, 1)',
    //     from: {
    //         color: 'rgba(255, 255, 255, 255)',
    //     }
    // });

    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
                <a.hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <sphere name='sphere1' diameter={3} segments={16} position={new Vector3(0, 1, 0)}>
                    <a.standardMaterial name='material' diffuseColor={colorProps.color}/>
                </sphere>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </Scene>
        </Engine>
    )
}


export function WithSpringCamera() {
    const cameraProps = useSpring({
        radius: 10,
        from: {
            radius: 30
        }
    });

    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <a.arcRotateCamera name='camera1' alpha={Math.PI/2} beta={Math.PI/4} radius={cameraProps.radius} target={Vector3.Zero()}/>
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <sphere name='sphere1' diameter={3} segments={16} position={new Vector3(0, 1, 0)}/>
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
