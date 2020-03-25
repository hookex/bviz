import {Mesh, Vector3} from "@babylonjs/core";
import React, {useState} from "react";
import {a, useSpring} from '../../react-babylon-spring';
import {useClick, useHover} from '../../hooks';
import Engine from "../../react-babylonjs/Engine";
import Scene from "../../react-babylonjs/Scene";
import {CreatedInstance} from "../../react-babylonjs/CreatedInstance";


export default function WithSpring() {
    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                {/*<WithSpringColor/>*/}
                <SpringDemo/>
                {/*<WithSpringScaling/>*/}
            </Scene>
        </Engine>
    )
}

let alpha = 0;

function SpringDemo() {
    const [refHover] = useHover(_ => {
        set({
            radius: 30,
        })
    }, _ => {
        set({
            radius: 10,
        })
    });

    const [refClick] = useClick(_ => {
        alpha += Math.PI * 2;
        set({
            alpha,
        })
    });

    const lightProps: any = useSpring({
        intensity: 1,
        from: {
            intensity: 0.5
        },
        delay: 1000,
        config: {
            duration: 500,
        }
    });

    const meshProps: any = useSpring({
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        from: {
            position: [-100, -100, 0],
            rotation: [0, Math.PI * 100, 0]
        }
    });

    const colorProps = useSpring({
        color: [0.9, 0.8, 0.7, 1],
        from: {
            color: [0, 0, 0, 1]
        }
    });

    const [props, set, stop] = useSpring(() => ({
        alpha,
        radius: 10,
    }));

    const refCb = (instance: any) => {
        refClick.current = instance;
        refHover.current = instance;
    };

    return (
        <>
            <a.arcRotateCamera name='camera1' alpha={props.alpha} beta={Math.PI / 4} radius={props.radius}
                               target={Vector3.Zero()}/>
            <a.hemisphericLight name='light1'
                                diffuse={colorProps.color}
                                intensity={lightProps.intensity}
                                direction={Vector3.Up()}/>

            <a.transformNode name='group' rotation={meshProps.rotation} position={meshProps.position}>
                <sphere ref={refCb} name='sphere1' diameter={3} segments={16}
                        position={new Vector3(0, 1.5, 0)}>
                    <a.standardMaterial name='material' diffuseColor={colorProps.color}/>
                </sphere>
                <ground name='ground1' width={6} height={6} subdivisions={2}/>
            </a.transformNode>
        </>
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
        from: {
            color: [0, 0, 1, 1]
        },
        to: async next => {
            while (true) {
                await next({color: [0, 1, 0, 1]})
                await next({color: [1, 0, 0, 1]})
                await next({color: [1, 1, 0, 1]})
                await next({color: [0, 1, 0, 1]})
                await next({color: [0, 1, 1, 1]})
            }
        }
    });

    const [hovered, setHovered] = useState(false);

    const [refGround] = useHover(_ => {
        setHovered(true);
    }, _ => {
        setHovered(false);
    });

    const groundProps = useSpring({
        color: hovered ? [0, 1, 0, 1] : [0, 0, 1, 1],
    });

    return (
        <>
            <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
            <a.hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
            <sphere name='sphere1' diameter={3} segments={16} position={new Vector3(0, 1.5, 0)}>
                <a.standardMaterial name='material' diffuseColor={colorProps.color}/>
            </sphere>
            <ground ref={refGround} name='ground1' width={6} height={6} subdivisions={2}>
                <a.standardMaterial name='ground-material' diffuseColor={groundProps.color}/>
            </ground>
        </>
    )
}

export function WithSpringScaling() {
    const [ref, hovered] = useHover();

    const props = useSpring({
        scaling: hovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
    });

    return (
        <>
            <arcRotateCamera name='camera1' alpha={Math.PI / 2} beta={Math.PI / 4}
                             radius={10} target={Vector3.Zero()}/>
            <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
            <a.sphere ref={ref} name='sphere1' scaling={props.scaling} diameter={3} segments={16}
                      position={new Vector3(0, 1, 0)}/>
            <ground name='ground1' width={6} height={6} subdivisions={2}/>
        </>
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


