export default async ()=>{

    //
    document.documentElement?.addEventListener("dragenter", (ev)=>{
        if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ui-desktop-grid, canvas[is=\"w-canvas\"]")) {
            ev.preventDefault();
        }
    });

    //
    document.documentElement?.addEventListener("dragover", (ev)=>{
        if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ui-desktop-grid, canvas[is=\"w-canvas\"]")) {
            ev.preventDefault();
        }
    });

    //
    document.documentElement?.addEventListener("drop", (ev)=>{
        if (document.elementFromPoint(ev.clientX, ev.clientY)?.matches?.(".ui-desktop-grid, canvas[is=\"w-canvas\"]")) {
            ev.preventDefault();

            //
            const {dataTransfer} = ev;
            const file = dataTransfer?.files?.[0];
            if (file != null) {
                const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                wallpaper?.["$useImageAsSource"]?.(file, false);
            }
        }
    });

};