import {useSpring} from "@react-spring/core";
import {animated} from "@react-spring/web";
import React, {useEffect, useState} from "react";

export default function SpringWithDom() {
    // const props = useSpring({opacity: 1, from: {opacity: 0}});
    // console.log('SpringWithDom', props.opacity);
    // return <animated.div style={props}>I will fade in</animated.div>
    const props = useSpring({ number: 1, from: { number: 0 } })
    console.log('props', props)
    return <animated.span>{props.number}</animated.span>
}

