import {MutableRefObject, useEffect, useRef, useState} from "react";
import {CreatedInstance} from "./react-babylonjs/CreatedInstance";
import {ActionEvent, ActionManager, ExecuteCodeAction, Mesh} from "@babylonjs/core";

export interface EventFunc {
    (ev: ActionEvent): void;
}

export function useHover(over?: EventFunc, out?: EventFunc): [MutableRefObject<CreatedInstance<Mesh|null>>, boolean] {
    const [value, setValue] = useState(false);

    const ref = useRef<CreatedInstance<Mesh>>(null) as MutableRefObject<CreatedInstance<Mesh|null>>;

    useEffect(() => {
       if (ref.current) {
            const mesh = ref.current.hostInstance as Mesh;

            if (!mesh.actionManager) {
                mesh.actionManager = new ActionManager(mesh.getScene());
            }

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOverTrigger, function (ev) {
                        over && over(ev);
                        setValue(true);
                    }
                )
            );

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOutTrigger, function (ev) {
                        out && out(ev);
                        setValue(false);
                    }
                )
            );
        }
    }, [ref.current])

    return [ref, value];
}

export function useClick(onClick: EventFunc): [MutableRefObject<CreatedInstance<Mesh|null>>]{
    const ref = useRef<CreatedInstance<Mesh>>(null) as MutableRefObject<CreatedInstance<Mesh|null>>;

    useEffect(() => {
        if (ref.current) {
            const mesh = ref.current.hostInstance as Mesh;

            if (!mesh.actionManager) {
                mesh.actionManager = new ActionManager(mesh.getScene());
            }

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger, function (ev) {
                        onClick(ev);
                    }
                )
            );
        }
    }, [ref.current])

    return [ref];
}

