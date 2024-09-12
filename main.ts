import "core-js";
import 'css-doodle';

//
(async()=>{
    //
    if ("virtualKeyboard" in navigator && navigator?.virtualKeyboard) {
        // @ts-ignore
        navigator.virtualKeyboard.overlaysContent = true;
    }

    //
    if (typeof navigator != "undefined") {
        await navigator?.serviceWorker?.register?.(new URL("./service.mjs", import.meta.url).href, {scope: "/"})?.catch?.(console.warn.bind(console));
    }

    //
    await Promise.all([
        import("./src/Main.ts"),
        import("./src/Main.scss")
    ])
})();
