import {RefObject, useEffect, useRef, useState} from "react";
import {CreatedInstance} from "./react-babylonjs/CreatedInstance";
import {ActionManager, ExecuteCodeAction, Mesh} from "@babylonjs/core";

export interface EventFunc {
    (mesh: Mesh): void;
}

export function useHover(over: EventFunc, out?: EventFunc): [RefObject<CreatedInstance<Mesh>>, boolean] {
    const [value, setValue] = useState(false);

    const ref = useRef<CreatedInstance<Mesh>>(null);

    useEffect(() => {
       if (ref.current) {
            const mesh = ref.current.hostInstance as Mesh;

            if (!mesh.actionManager) {
                mesh.actionManager = new ActionManager(mesh.getScene());
            }

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOverTrigger, function (ev) {
                        over && over(mesh);
                        setValue(true);
                    }
                )
            );

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOutTrigger, function (ev) {
                        out && out(mesh);
                        setValue(false);
                    }
                )
            );
        }
    }, [ref.current, over, out])

    return [ref, value];
}

export function useClick(onClick: EventFunc) {
    const ref = useRef<CreatedInstance<Mesh>>(null);

    useEffect(() => {
        if (ref.current) {
            const mesh = ref.current.hostInstance as Mesh;
            if (!mesh.actionManager) {
                mesh.actionManager = new ActionManager(mesh.getScene());
            }

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPickTrigger, function (ev) {
                        onClick(mesh);
                    }
                )
            );
        }
    }, [ref.current, onClick])

    return [ref];
}

