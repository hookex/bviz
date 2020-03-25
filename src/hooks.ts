import {MutableRefObject, useEffect, useRef, useState} from "react";
import {CreatedInstance} from "./react-babylonjs/CreatedInstance";
import {ActionManager, ExecuteCodeAction, Mesh} from "@babylonjs/core";

export interface EventFunc {
    (mesh: Mesh): void;
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
                        onClick(mesh);
                    }
                )
            );
        }
    }, [ref.current, onClick])

    return [ref];
}

