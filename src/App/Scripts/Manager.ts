//
import { pickWallpaperImage } from "@idc/PreInit/ActionMap.ts";
import { useFS } from "@unite/scripts/utils/Utils.ts";

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
    const fs = await useFS();

    //
    const entries: any[] = [];
    const dir = await fs.readDir("/images/");
    const it = await (dir?.unwrap?.() ?? dir);
    while (true) {
        const v = (await it.next())?.value;
        if (!v) break; entries.push([v.path, v.handle]);
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
export const addItemEv = async (ev, state)=>{
    const fs = await useFS();

    //
    pickWallpaperImage()
        .catch(console.warn.bind(console))
        .then(async (blob) => {
            if (blob) {
                const fn = (blob?.name || "wallpaper");
                await fs.mkdir("/images/");
                await fs.writeFile("/images/" + fn, blob);

                //
                files.set(fn, blob);

                //
                state.selectedFilename = fn;
                state.fileList = files;

                //
                await getFileList(fs, state);
            }
        });
}

//
export const removeItemEv = async (ev, state)=>{
    const fs = await useFS();

    //
    const {selectedFilename} = state;
    if (selectedFilename) {
        (async ()=>{
            if (("/opfs?path=images/" + (selectedFilename || "wallpaper")) != localStorage.getItem("@wallpaper")) {
                await fs.mkdir("/images/");
                await fs.remove(selectedFilename);

                //
                files.delete(selectedFilename);
                state.selectedFilename = null;
                state.fileList = files;

                //
                await getFileList(fs, state);
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
