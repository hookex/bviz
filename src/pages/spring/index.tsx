import {Color3, Vector3} from "@babylonjs/core";
import React, {useState} from "react";
import {a, useSpring, useSprings} from '../../react-babylon-spring';
import {useClick, useHover} from '../../hooks';
import Engine from "../../react-babylonjs/Engine";
import Scene from "../../react-babylonjs/Scene";


export default function WithSpring() {
    return (
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                {/*<WithSpringColor/>*/}
                {/*<SpringDemo/>*/}
                {/*<WithSpringScaling/>*/}
                <WithBoxes/>
            </Scene>
        </Engine>
    )
}

let alpha = 0;

function SpringDemo() {
    const [refSphereHover, isHovering] = useHover(_ => {
        set({
            radius: 10,
        })
    }, _ => {
        set({
            radius: 12,
        })
    });

    const [refSphereClick] = useClick(_ => {
        alpha += Math.PI * 2;
        setProps({
            rotation: [0, alpha, 0]
        })
    });

    const lightProps: any = useSpring({
        intensity: 1,
        color: [0.9, 0.8, 0.7, 1],
        from: {
            intensity: 0.5
        },
        delay: 1000,
        config: {
            duration: 500,
        },
    });

    const [props, setProps] = useSpring(() => ({
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scaling: isHovering ? [2, 2, 2] : [1, 1, 1],
        color: isHovering ? [0.3, 0.6, 0.9, 1] : [0.9, 0.8, 0.7, 1],
        groundPosition: isHovering ? [0, -3, 0] : [0, 0, 0],
        from: {
            position: [-100, -100, 0],
            rotation: [0, Math.PI * 100, 0],
            color: [0, 0, 0, 1]
        }
    }));

    const [cameraProps, set, stop] = useSpring(() => ({
        alpha,
        beta: Math.PI / 4,
        radius: 12,
        from: {
            beta: Math.PI / 2,
        }
    }));

    const refCb = (instance: any) => {
        refSphereClick.current = instance;
        refSphereHover.current = instance;
    };

    return (
        <>
            <a.arcRotateCamera name='camera1' alpha={0} beta={cameraProps.beta} radius={cameraProps.radius}
                               target={Vector3.Zero()}/>
            <a.hemisphericLight name='light1'
                                diffuse={lightProps.color}
                                intensity={lightProps.intensity}
                                direction={Vector3.Up()}/>
            <a.sphere ref={refCb} name='sphere1' diameter={3} segments={16}
                      scaling={props.scaling}
                      position={new Vector3(0, 1.5, 0)}>
                <a.standardMaterial name='material' diffuseColor={props.color}/>
            </a.sphere>
            <a.ground position={props.groundPosition}
                      name='ground1' width={6} height={6} subdivisions={2}/>

            <a.transformNode name='group' rotation={props.rotation} position={props.position}>
                <a.sphere name='sphere1' diameter={0.4} segments={16}
                          position={new Vector3(4, 2, 0)}>
                </a.sphere>
            </a.transformNode>

        </>
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


const getRandomColor = (function () {
    // const Colors = ['#4F86EC', '#D9503F', '#F2BD42', '#58A55C'];
    const Colors = [[0.31, 0.53, 0.93, 1], [0.85, 0.31, 0.25, 1], [0.95, 0.74, 0.26, 1], [0.35, 0.65, 0.36, 1]];

    let i = 0;
    return () => {
        i++;
        return Colors[i % Colors.length];
    }
})();

function getCyclePosition(i: number, blankRadius: number) {
    i += blankRadius;
    let angle = i % Math.PI * 2;
    const x = i * Math.cos(angle);
    const z = i * Math.sin(angle);

    return [x, z];
}

function WithBoxes() {
    const [props, set] = useSprings(100, i => {
        const [x, z] = getCyclePosition(i, 30);

        return {
            position: [x, 20, z],
            color: getRandomColor(),
            from: {
                position: [x, Math.random() * 50 - 60, z],
            },
            config: {
                duration: 3000,
            }
        }
    });

    const [ref, isHovering] = useHover(_ => {
        set((index, ctrl) => {
            return {
                color: getRandomColor(),
                position: [0, 20, 0],
                config: {
                    duration: 2000,
                }
            }
        });
    }, _ => {
        set(i => {
            const [x, z] = getCyclePosition(i, 30);
            return {
                position: [x, 20, z],
                config: {
                    duration: 2000,
                }
            }
        });
    });

    const groupProps = useSpring({
        rotation: isHovering ? [0, Math.PI * 2, 0] : [0, 0, 0],
        config: {
            duration: 2000
        }
    });

    return (
        <>
            <freeCamera name='camera1' position={new Vector3(0, 200, -200)} setTarget={[Vector3.Zero()]}/>
            <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>

            <a.transformNode name='' rotation={groupProps.rotation}>
                {
                    props.map(({position, color}, i) =>
                        <a.box key={i} name='' width={6} height={16} depth={6} position={position}>
                            <a.standardMaterial name='' diffuseColor={color}/>
                        </a.box>
                    )
                }
            </a.transformNode>


            <sphere ref={ref} name='' diameter={40} position={new Vector3(0, 20, 0)}>
                <standardMaterial name='' diffuseColor={new Color3(0.3, 0.6, 0.9)}/>
            </sphere>

            <ground name='ground1' width={1000} height={1000} subdivisions={2}/>
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


