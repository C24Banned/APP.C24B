import {JSOX} from 'jsox';

//
import {makeReactive} from "@unite/scripts/reactive/ReactiveLib.ts";
import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";
import { changeZoom } from "@unite/scripts/utils/Zoom.ts";

//
export const settings = makeReactive(Object.assign({
    iconShape: "wavy",
    columns: 4,
    rows: 8,
    theme: 0,
    orientation: 0,
    scaling: 1,
    useZoom: true
}, JSOX.parse(localStorage.getItem("@settings") || "{}") || {}), "settings")

//
changeZoom(settings.scaling || 1);

//
subscribe(settings, () => {
    localStorage.setItem("@settings", JSOX.stringify(settings));
})

//
subscribe(settings, (v) => {
    document.documentElement.classList.remove("__exp-use-zoom");
    document.documentElement.classList.remove("__use_font-size");

    //
    if (!!v) {
        document.documentElement.classList.remove("__use_font-size");
        document.documentElement.classList.add("__exp-use-zoom");
    } else {
        document.documentElement.classList.remove("__exp-use-zoom");
        document.documentElement.classList.add("__use_font-size");
    }
}, "useZoom");


//
subscribe(settings, (v) => {
    const target = document.documentElement;
    if (v == -1) { target.setAttribute("data-theme", "dark"); }
    if (v ==  0) { target.removeAttribute("data-theme"); }
    if (v ==  1) { target.setAttribute("data-theme", "light"); }

    //
    localStorage.setItem("@settings:@theme", v || 0);
}, "theme");

//
subscribe(settings, (v) => {
    document.documentElement.dataset["orientation"] = v || "auto";
    (async () => {
        switch (v || "auto") {
            case "auto":
                await screen.orientation?.lock?.(screen.orientation.type);
                await screen.orientation.unlock();
                break;

            default:
                await screen.orientation?.lock?.(v || "any");
                break;
        }
    })().catch(console.warn.bind(console));
}, "orientation");


//
subscribe(settings, (v) => {
    document.documentElement.style.setProperty("--layout-c", v || 4);
}, "columns");

//
subscribe(settings, (v) => {
    document.documentElement.style.setProperty("--layout-r", v || 8);
}, "rows");

//
subscribe(settings, (v) => {
    changeZoom(v || 1);
}, "scaling");

//
subscribe(settings, (v) => {
    const grid = document.querySelector(".ui-desktop-grid") as HTMLElement;
    if (grid) { grid.dataset.shape = v; };
}, "iconShape");

//
import("@idc/Core/Event.ts").then((m)=>{
    m?.default?.fire?.("app-state-loaded", {
        settings
    });
});
