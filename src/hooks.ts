import {RefObject, useEffect} from "react";
import {CreatedInstance} from "./react-babylonjs/CreatedInstance";
import {ActionManager, ExecuteCodeAction, Mesh} from "@babylonjs/core";

export interface EventFunc {
    (mesh: Mesh): void;
}


export function useHover(ref: RefObject<CreatedInstance<Mesh>>, over: EventFunc, out?: EventFunc) {
    useEffect(() => {
        if (ref && ref.current) {

            const mesh = ref.current.hostInstance as Mesh;

            if (!mesh.actionManager) {
                mesh.actionManager = new ActionManager(mesh.getScene());
            }

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOverTrigger, function (ev) {
                        over && over(mesh);
                    }
                )
            );

            mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    ActionManager.OnPointerOutTrigger, function (ev) {
                        out && out(mesh);
                    }
                )
            );
        }
    }, [ref, over, out])
}

export function useClick(ref: RefObject<CreatedInstance<Mesh>>, onClick: EventFunc) {
    useEffect(() => {
        if (ref && ref.current) {
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
    }, [ref, onClick])
}

