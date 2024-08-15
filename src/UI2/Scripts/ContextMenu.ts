

//
import {zoomOf} from "@unite/scripts/utils/Zoom.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts";
import { MOC, MOCElement } from "@unite/scripts/utils/Utils.ts";

//
export default async ()=>{
    const settings = stateMap.get("settings");
    const actionMap = stateMap.get("actionMap");

    //
    const initiators = new Map<string, HTMLElement>();
    const hideAllCtx = ()=>{
        initiators.clear();
        document.querySelectorAll(".ui-context-menu").forEach((el)=>{
            el.dataset.hidden = true;
        });
    }

    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;

        //
        ev.stopPropagation();
        ev.preventDefault();

        //
        hideAllCtx();

        //
        if (target.matches("*[data-ctx], *[data-ctx] .ui-item-design")) {
            const real = MOCElement(target, "*[data-ctx]");
            const ctxName = real.dataset.ctx;
            initiators.set(ctxName, real);

            //
            requestAnimationFrame(()=>{
                const ctxMenu: HTMLElement | null = document.querySelector(".ui-context-menu[data-ctx-name=\""+ctxName+"\"]");
                if (ctxMenu) {
                    ctxMenu.dataset.hidden = false;
                    ctxMenu.style.setProperty("--click-x", ev.clientX as unknown as string, "");
                    ctxMenu.style.setProperty("--click-y", ev.clientY as unknown as string, "");
                }
            })
        }
    }, {capture: true});

    //
    document.documentElement.addEventListener("contextmenu", (ev)=>{
        const target = ev.target as HTMLElement;
        if ((target?.matches?.(".ui-modal-frame") || target?.closest?.(".ui-modal-frame")) && !target.matches("input[type=\"text\"]")) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
        }
    }, {capture: true});

    //
    const onClick = (ev)=>{
        const target = ev.target as HTMLElement;

        //
        const initiator = initiators.get(target.closest(".ui-context-menu").dataset.ctxName);
        actionMap?.get?.(target.dataset.action as string)?.({
            initiator
        });

        //
        hideAllCtx();
    }

    //
    document.addEventListener("click", (ev)=>{
        const target = ev.target as HTMLElement;

        //
        if (target.matches(".ui-context-menu *[data-action]")) {
            onClick(ev);
        }

        //
        if (!MOC(target, ".ui-context-menu[data-ctx-name]") || target.matches("*[data-action]")) {
            requestAnimationFrame(()=>{
                hideAllCtx();
            });
        }
    });
}