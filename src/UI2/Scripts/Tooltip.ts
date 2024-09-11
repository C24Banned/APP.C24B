import AxGesture from "@ux-ts/interact/Gesture.ts";
import {pointerMap} from "@ux-ts/interact/PointerAPI.ts";

//
export default async ()=>{

    //
    const timer = Symbol("@disappear");
    const fixTooltip = (ev)=>{
        const tooltip = document.querySelector(".ui-tooltip") as HTMLElement;
        if (tooltip && (ev?.target as HTMLElement)?.dataset?.tooltip) {
            tooltip.style.setProperty("--hover-x", (ev?.clientX || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
            tooltip.style.setProperty("--hover-y", (ev?.clientY || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
            requestAnimationFrame(()=>{
                tooltip.style.setProperty("--hover-x", (pointerMap.get(ev.pointerId)?.current?.[0] || ev?.clientX || tooltip.style.getPropertyValue("--hover-x") || 0) as unknown as string, "");
                tooltip.style.setProperty("--hover-y", (pointerMap.get(ev.pointerId)?.current?.[1] || ev?.clientY || tooltip.style.getPropertyValue("--hover-y") || 0) as unknown as string, "");
            });
        }
    }

    //
    document.addEventListener("pointerover", fixTooltip);
    document.addEventListener("pointerdown", fixTooltip);

    //
    const controller = new AxGesture(document.documentElement);
    controller.longHover({
        selector: "*[data-tooltip]",
        holdTime: 500
    }, (ev)=>{
        const initiator = ev.target;
        const tooltip: HTMLElement | null = document.querySelector(".ui-tooltip");
        if (tooltip) {
            {
                if (tooltip[timer]) clearTimeout(tooltip[timer]);
                tooltip.dataset.hidden = ""+true;
                tooltip[timer] = null;
            }

            //
            tooltip.innerHTML = initiator.dataset.tooltip;
            fixTooltip(ev);
            tooltip.dataset.hidden = ""+false;
            tooltip[timer] = setTimeout(()=>{
                tooltip.dataset.hidden = ""+true;
            }, 1000);
        }
    });

    //
    const hideTooltip = (ev)=>{
        const tooltip: HTMLElement | null = document.querySelector(".ui-tooltip");
        if (tooltip) {
            if (tooltip[timer]) clearTimeout(tooltip[timer]);
            tooltip.dataset.hidden = ""+true;
            tooltip[timer] = null;
        }
    }

    //
    document.documentElement.addEventListener("pointerout", (ev)=>{
        if ((ev?.target as HTMLElement)?.dataset?.tooltip) {
            hideTooltip(ev);
        }
    });
    document.documentElement.addEventListener("click", hideTooltip);
    document.documentElement.addEventListener("pointerup", hideTooltip);
    document.documentElement.addEventListener("pointerdown", hideTooltip);

};
