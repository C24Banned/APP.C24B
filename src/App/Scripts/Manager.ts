//
import { pickWallpaperImage } from "@idc/State/ActionMap.ts";

// Function to download data to a file
export const downloadImage = async (file) => {
    const filename = file.name || "wallpaper";

    //
    if ("msSaveOrOpenBlob" in self.navigator) {
        // IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    //
    // @ts-ignore
    const fx = await (self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                // @ts-ignore
                showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
                // @ts-ignore
                showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window),
                // @ts-ignore
            })
        )
        : import("@unite/scripts/polyfill/showOpenFilePicker.mjs"));

    //
    // @ts-ignore
    if (window?.showSaveFilePicker) {
        // @ts-ignore
        const fileHandle = await self
            ?.showSaveFilePicker?.({
                suggestedName: filename
            })
            ?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle
            ?.createWritable?.({ keepExistingData: true })
            ?.catch?.(console.warn.bind(console));
        await writableFileStream
            ?.write?.(file)
            ?.catch?.(console.warn.bind(console));
        await writableFileStream?.close()?.catch?.(console.warn.bind(console));
    } else {
        // Others
        let url = "";
        const a = document.createElement("a");
        a.href = url = URL.createObjectURL(file);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

//
const files = new Map([]);

//
export const getFileList = async (exists, state)=>{
    let wall = null;

    //
    if (exists) { wall = exists; } else {
        const root = await navigator?.storage?.getDirectory?.();
        wall = await root?.getDirectoryHandle?.("images");
    }

    //
    const it = await wall?.entries();//getFileHandle()
    const entries = [];
    while (true) {
        const v = (await it.next())?.value;
        if (!v) break; entries.push(v);
    }

    //
    if (entries) {
        await Promise.all(entries.filter(([fn,fm])=>(fm instanceof FileSystemFileHandle)).map(async ([fn,fm])=>{
            files.set(fn, await fm.getFile());
        }));
        if (state) { state.fileList = files; };
    }

    //
    return files;
}

//
export const selectFileEv = (ev, state)=>{
    document.querySelectorAll("#manager .file").forEach((el)=>{
        el.classList.remove("selected");
    });

    //
    ev.target.classList.add("selected");

    //
    state.selectedFilename = ev.target.dataset.filename;
}

//
export const useItemEv = (ev, state)=>{
    return getFileList(null, state).then(()=>{
        const {selectedFilename} = state;
        if (selectedFilename && files.has(selectedFilename)) {
            const file = files.get(selectedFilename);
            if (file != null) {
                const wallpaper = document.querySelector("canvas[is=\"w-canvas\"]");
                wallpaper?.["$useImageAsSource"]?.(file, true).then((file)=>{
                    files.set(selectedFilename, file);
                    state.fileList = files;
                });
            }
        }
    });
}

//
export const addItemEv = (ev, state)=>{
    pickWallpaperImage()
        .catch(console.warn.bind(console))
        .then(async (blob) => {
            if (blob) {
                //
                const root = await navigator?.storage?.getDirectory?.();
                const wall = await root?.getDirectoryHandle?.("images");

                //
                const fn = blob?.name || "wallpaper";
                const fw = await (await wall?.getFileHandle?.(fn, {
                    create: true,
                }))?.createWritable?.({
                    keepExistingData: true
                });

                //
                await fw?.write?.(blob);
                await fw?.flush?.();
                await fw?.close?.();

                //
                files.set(fn, blob);

                //
                state.selectedFilename = fn;
                state.fileList = files;

                //
                await getFileList(wall, state);
            }
        });
}

//
export const removeItemEv = (ev, state)=>{
    const {selectedFilename} = state;
    if (selectedFilename) {
        (async ()=>{
            if (("/opfs?path=images/" + (selectedFilename || "wallpaper")) != localStorage.getItem("@wallpaper")) {
                const root = await navigator?.storage?.getDirectory?.();
                const wall = await root?.getDirectoryHandle?.("images");
                await wall?.removeEntry?.(selectedFilename);

                //
                files.delete(selectedFilename);
                state.selectedFilename = null;
                state.fileList = files;

                //
                await getFileList(wall, state);
            }
        })();
    }
}

//
export const downloadItemEv = (ev, state)=>{
    const {selectedFilename} = state;
    return getFileList(null, state).then(()=>{
        if (selectedFilename && files.has(selectedFilename)) {
            downloadImage(files.get(selectedFilename));
        }
    });
}
