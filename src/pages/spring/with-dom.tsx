import {animated, useSpring} from "react-spring";
import React from "react";

export function SpringWithDom() {
    const props = useSpring({opacity: 1, from: {opacity: 0}});
    return <animated.div style={props}>I will fade in</animated.div>
}
