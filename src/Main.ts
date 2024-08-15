// Initiate loading instantly
import $Bundle from "@unite/scripts/stylework/Bundle.ts";
import i18n from "./L18n/L18n.ts";
import { createI18n } from 'vue-i18n'
import { observeAttribute } from "../unite/scripts/dom/Observer.ts";

//
const preInit = Promise.allSettled([
    import("@idc/PreInit/InitScreen.ts").catch(console.warn.bind(console))
]).then((init) => {
    return Promise.allSettled(Array.from(init).map((rv)=>{
        const def = rv?.value?.default;
        if (typeof def == "function") { return def?.()?.catch?.(console.warn.bind(console)); };
        return def;
    }))?.catch?.(console.warn.bind(console));
});

//
preInit.then(async ()=>{
    //
    const loading = Promise.allSettled([
        import("@idc/UI2/Scripts/Dropper.ts"),
        import("@idc/UI2/Scripts/AppFrame.ts"),
        import("@idc/UI2/Scripts/ContextMenu.ts"),
        import("@idc/UI2/Scripts/DesktopGrid.ts"),
        import("@idc/UI2/Scripts/InputEdit.ts"),
        import("@idc/UI2/Scripts/ItemEdit.ts"),
        import("@idc/UI2/Scripts/StatusBar.ts"),
        import("@idc/UI2/Scripts/Tooltip.ts"),
        import("@idc/UI2/Scripts/ShapeSelect.ts"),
        import("@idc/App/Scripts/Settings.ts"),
        import("@idc/App/Scripts/ControlCenter.ts"),
        import("@unite/wcomp/scrollbox/ScrollBox.ts"),
        import("@unite/wcomp/flexlike/FlexLike.ts")
    ]);

    //
    const services = Promise.allSettled([
    ]);

    //
    (await services).map((mod)=>{
        const lazy = mod?.value?.default;
        if (typeof lazy == "function") { lazy?.(); };
    });

    //
    const {createApp} = await import("vue");
    const App = (await import("./Main.vue")).default;
    const app = createApp(App);
    app.use(i18n)
    app.directive("observe", {
        created: (el, binding, vNode, prevNode) => {
            observeAttribute(el, binding.arg, (mut)=>{
                binding?.value?.(el.getAttribute(binding.arg));
            });
        }
    });
    app.mount(document.body);

    //
    (await loading).map((mod)=>{
        const lazy = mod?.value?.default;
        if (typeof lazy == "function") { lazy?.(); };
    });
});

//
document.documentElement.style.setProperty("--theme-base-color", localStorage.getItem("--theme-base-color") || "oklch(50% 0.3 0)", "");
document.documentElement.style.setProperty("--theme-wallpaper-is-dark", localStorage.getItem("--theme-wallpaper-is-dark") || "0", "");

// avoid any dragging when no-needed...
document.documentElement.addEventListener("dragstart", (ev) => {
    if ((ev?.target as HTMLElement)?.matches?.("div, img, picture, canvas, video, svg")) {
        ev.preventDefault();
    }
}, {passive: false, capture: true});
