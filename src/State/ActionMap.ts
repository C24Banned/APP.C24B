import {state} from "./GridState.ts";
import type {GridItemType} from "@unite/scripts/utils/GridItemUtils.ts";
import {makeReactive} from "@unite/scripts/reactive/ReactiveLib.ts";
import {redirectCell} from "@unite/scripts/utils/GridItemUtils.ts";

//
import Timer from "@unite/scripts/performance/Time.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts"

//
import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

//
import {
    exportSettings,
    importSettings,
    pickBinaryFromFS,
    saveBinaryToFS,
} from "./ImportExport.ts";

//
export const UIState = makeReactive({
    taskPanelOpen: false,
    itemOnEdit: null,
    currentGridPage: "main"
}, "UIState");
//UIState

//
export const UUIDv4 = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            +c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16)
    );
};

//
export const pickWallpaperImage = async () => {
    const fpc = self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                showOpenFilePicker: window.showOpenFilePicker.bind(window),
                showSaveFilePicker: window.showSaveFilePicker.bind(window),
            })
        )
        : /* webpackPrefetch: true */ import(
            "@unite/scripts/polyfill/showOpenFilePicker.mjs"
        );

    //
    const fx = await fpc;
    return (fx?.showOpenFilePicker ?? window?.showOpenFilePicker)({
        types: [
            {
                description: "wallpaper",
                accept: {
                    "image/*": [
                        ".png",
                        ".gif",
                        ".jpg",
                        ".jpeg",
                        ".webp",
                        ".jxl",
                    ],
                },
            },
        ],
        startIn: "pictures",
        multiple: false,
    })
        .then(([handle] = []) => handle?.getFile?.())
        .catch(console.warn.bind(console));
};

//
//export const windowManager = new WindowManager();


//
const actionMap = makeReactive(new Map<string, Function>([

    [
        "export-data",
        async () => {
            await saveBinaryToFS(
                (await exportSettings().catch(console.warn.bind(console))) || ""
            ).catch(console.warn.bind(console));
        },
    ],
    [
        "import-data",
        async () => {
            await importSettings(
                (await pickBinaryFromFS().catch(console.warn.bind(console))) ||
                ""
            ).catch(console.warn.bind(console)).then(() => {
                setTimeout(() => location.reload(true), 100);
            });


        },
    ],


    ["fullscreen", Timer.protect(() => {
        //
        if (!document.fullscreenElement) {
            document.documentElement?.requestFullscreen?.({
                navigationUI: "hide",
            })?.catch?.(console.warn.bind(console));
        } else
            if (document.exitFullscreen) {
                document?.exitFullscreen?.();
            }
    }, 100)],


    ["open-manager", ({initiator}) => {
        if (location.hash != "#manager")
            {
                const oldHash = location.hash;
                history.replaceState(null, null, "#manager");
                window.dispatchEvent(new HashChangeEvent("hashchange", {
                    oldURL: oldHash,
                    newURL: location.hash
                }));
            };
    }],

    ["open-settings", ({initiator}) => {
        if (location.hash != "#settings")
            {
                const oldHash = location.hash;
                history.replaceState(null, null, "#settings");
                window.dispatchEvent(new HashChangeEvent("hashchange", {
                    oldURL: oldHash,
                    newURL: location.hash
                }));
            };
    }],

    [
        "open-link-in-frame",
        ({
            initiator
        }) => {
            // unsupported...
        },
    ],

    [
        "open-link",
        ({
            initiator
        }) => {
            window.open(initiator.dataset.href, (!initiator.dataset.href || initiator.dataset.href.startsWith("#")) ? "_self" : "_blank");
        },
    ],

    ["edit-item", ({initiator}) => {
        if (initiator) {
            const item = state.items.get(initiator.dataset.id || "");
            UIState.itemOnEdit = item;
        }
    }],


    ["delete-item", ({initiator}) => {
        if (initiator) {
            const ID = initiator.dataset.id || "";

            //
            state.items.delete(ID);
            state.items = state.items;

            //
            UIState.itemOnEdit = null;

            //
            for (const L of state.lists) {
                L[1].delete(ID);
                state.lists.set(...L);
            }
            state.lists = state.lists;
        }
    }],


    ["add-item", ({initiator}) => {
        if (initiator && initiator.dataset.currentPage) {
            const currentPage = initiator.dataset.currentPage;
            const newItem = makeReactive({
                id: UUIDv4(),
                cell: [0, 0],
                icon: "file-question",
                label: "Untitled",
                pointerId: -1,
                action: "open-link",
                href: "#"
            });

            //
            state.items.set(newItem.id, newItem);
            state.lists.get(currentPage)?.add?.(newItem.id);

            //
            redirectCell(newItem.cell, {item: newItem, items: state.items, page: state.grids.get(currentPage)});

            //
            state.items = state.items;
            state.lists = state.lists;

            //
            UIState.itemOnEdit = newItem;
        }
    }],


    [
        "change-wallpaper",
        ({}) => {
            const wallpaper = document.querySelector('canvas[is="w-canvas"]');
            if (wallpaper) {
                pickWallpaperImage()
                    .catch(console.warn.bind(console))
                    .then((blob) => {
                        wallpaper?.["$useImageAsSource"]?.(blob, false);
                    });
            }
        },
    ],
]), "actionMap");

//
export default actionMap;
