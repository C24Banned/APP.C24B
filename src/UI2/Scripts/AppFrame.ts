//
import { MOCElement } from "@ux-ts/utils/Utils.ts";
import AxGesture from "@ux-ts/interact/Gesture.ts";
import { observeBySelector } from "@ux-ts/dom/Observer.ts";
import { zoomOf } from "@ux-ts/utils/Zoom.ts";

//
import TaskManager from "@idc/PreInit/TaskManager.ts";


//
export default async ()=>{

    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;
        if ((target?.matches?.(".ui-app-frame") || target?.closest?.(".ui-app-frame")) && !target.matches("input[type=\"text\"]")) {
            ev.stopPropagation();
            //ev.stopImmediatePropagation();
            ev.preventDefault();
        }
    }, {capture: true});

    //
    document.documentElement.addEventListener("click", (ev)=>{
        const target = ev.target as HTMLElement;

        //
        if (target.matches(".ui-app-frame *:not(.back-button, .menu-button)")) {
            //ev.stopPropagation();
            //ev.stopImmediatePropagation();
            //ev.preventDefault();

            //
            //if (windowManager) {
                //windowManager?.focusTask?.("#" + MOCElement(target, ".ui-app-frame")?.querySelector(".ui-content")?.id||"");
            //}
        }


        //
        if (target.matches(".ui-navbar .menu-button")) {
            // kuril i umer
            ev.stopPropagation();
            //ev.stopImmediatePropagation();
            ev.preventDefault();

            //
            const task = TaskManager.getOnFocus();
            const content = task?.id ? document.querySelector(task?.id) : null;
            if (content) {
                const event = new CustomEvent("ui-menu", {
                    cancelable: true,
                    bubbles: true,
                    detail: {}
                });
                content.dispatchEvent(event);
                requestAnimationFrame(()=>navigator?.vibrate?.([10]))
            }
        }

        //
        if (target.matches(".ui-navbar .back-button")) {
            // kuril i umer
            ev.stopPropagation();
            //ev.stopImmediatePropagation();
            ev.preventDefault();

            //
            const task = TaskManager.getOnFocus();
            const content = task?.id ? document.querySelector(task?.id) : null;
            if (content) {
                const event = new CustomEvent("ui-back", {
                    cancelable: true,
                    bubbles: true,
                    detail: { target: content }
                });
                requestAnimationFrame(()=>navigator?.vibrate?.([10]))

                //
                if (window.dispatchEvent(event)) {
                    //if (windowManager) {
                        //windowManager?.minimizeTask?.("#" + content.id);
                    //} else {
                        //history.back();
                    //}
                    TaskManager.deactivate(task?.id);
                }
            }
        }

        //
        if (target.matches(".ui-app-frame .menu-button")) {
            // kuril i umer
            ev.stopPropagation();
            //ev.stopImmediatePropagation();
            ev.preventDefault();

            //
            const content = MOCElement(target, ".ui-app-frame")?.querySelector?.(".ui-content");
            if (content) {
                const event = new CustomEvent("ui-menu", {
                    cancelable: true,
                    bubbles: true,
                    detail: {}
                });
                content.dispatchEvent(event);
                requestAnimationFrame(()=>navigator?.vibrate?.([10]))
            }
        }

        //
        if (target.matches(".ui-app-frame .back-button")) {
            // kuril i umer
            ev.stopPropagation();
            //ev.stopImmediatePropagation();
            ev.preventDefault();

            //
            const content = MOCElement(target, ".ui-app-frame")?.querySelector?.(".ui-content");
            if (content) {
                const task = TaskManager.get("#" + content.id);
                const event = new CustomEvent("ui-back", {
                    cancelable: true,
                    bubbles: true,
                    detail: { target: content }
                });
                requestAnimationFrame(()=>navigator?.vibrate?.([10]))

                //
                if (window.dispatchEvent(event)) {
                    //if (windowManager) {
                        //windowManager?.minimizeTask?.("#" + content.id);
                    //} else {
                        //history.back();
                    //}
                    TaskManager.deactivate("#" + content.id);
                }
            }
        }
    })

    //
    const makeControl = (frameElement)=>{
        let gestureControl: AxGesture | null = null;
        if (frameElement && !frameElement["@control"]) {
            gestureControl = new AxGesture(frameElement);
            frameElement["@control"] = gestureControl;

            //
            gestureControl.draggable({
                handler: frameElement.querySelector(".ui-title-handle")
            });

            //
            gestureControl.resizable({
                handler: frameElement.querySelector(".ui-resize")
            });
        }

        //
        if (frameElement) {
            // @ts-ignore
            frameElement.style.setProperty("--drag-x", (frameElement.parentNode.clientWidth - Math.min(Math.max(frameElement.offsetWidth, 48*16/0.8), frameElement.parentNode.clientWidth)) * (zoomOf() / 2), "");

            // @ts-ignore
            frameElement.style.setProperty("--drag-y", (frameElement.parentNode.clientHeight - Math.min(Math.max(frameElement.offsetHeight, 24*16/0.8), frameElement.parentNode.clientHeight)) * (zoomOf() / 2), "");
        }
    }

    //
    observeBySelector(document.body, ".ui-app-frame", ({addedNodes})=>{
        addedNodes.forEach((n)=>makeControl(n));
    });

}
