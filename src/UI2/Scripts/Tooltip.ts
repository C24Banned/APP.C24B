import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
import { MOC, propsFilter } from "@unite/scripts/utils/Utils.ts";
import AxGesture from "@unite/scripts/interact/Gesture.ts";
import {pointerMap} from "@unite/scripts/interact/PointerAPI.ts";

//
export default async ()=>{

    //
    const timer = Symbol("@disappear");

    //
    const controller = new AxGesture(document.documentElement);
    controller.longHover({
        selector: "*[data-tooltip]",
        holdTime: 500
    }, (ev)=>{
        const initiator = ev.target;
        const tooltip = document.querySelector(".ui-tooltip");
        if (tooltip) {
            {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip.dataset.hidden = true;
                tooltip[timer] = null;
            }

            //
            tooltip.innerHTML = initiator.dataset.tooltip;
            if (pointerMap.get(ev.pointerId)?.current) {
                tooltip.style.setProperty("--hover-x", (pointerMap.get(ev.pointerId)?.current?.[0] || 0), "");
                tooltip.style.setProperty("--hover-y", (pointerMap.get(ev.pointerId)?.current?.[1] || 0), "");
            }
            tooltip.dataset.hidden = false;
            tooltip[timer] = setTimeout(()=>{
                tooltip.dataset.hidden = true;
            }, 1000);
        }
    });

    //
    document.documentElement.addEventListener("click", ()=>{
        const tooltip = document.querySelector(".ui-tooltip");
        if (tooltip) {
            if (tooltip[timer]) clearTimeout(tooltip[timer]);
            tooltip.dataset.hidden = true;
            tooltip[timer] = null;
        }
    });

};
