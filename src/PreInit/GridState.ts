import {JSOX} from 'jsox';

//
import {makeReactive, createReactiveSet, createReactiveMap} from "@ux-ts/reactive/ReactiveLib.ts";
import {makeObjectAssignable} from "@ux-ts/reactive/AssignObject.ts";
import stateMap from "@ux-ts/reactive/StateManager.ts"
import {subscribe, extractSymbol} from "@ux-ts/reactive/ReactiveLib.ts";

//
import {settings} from "./CurrentState.ts";

//
import type {GridItemType, GridsStateType, GridPageType} from "@unite/grid/GridItemUtils.ts";
import { observeBorderBox, observeBySelector } from "@/unite/scripts/dom/Observer.ts";

//
const isArrayLike = (a) => {
    return (
        a != null &&
        typeof (a[Symbol.iterator]) === 'function' &&
        typeof (a.length) === 'number' &&
        typeof (a) !== 'string'
    );
}

//
export const toMapSet = <K, V>(list) => {
    return createReactiveMap<K, V>(list.map(([id, list2]) => [id, createReactiveSet((isArrayLike(list2) ? Array.from(list2) : null) || [])]));
};

//
export const toMap = <K, V>(list) => {
    const array = (list instanceof Map) ? Array.from(list.values()) : list;
    return createReactiveMap<K, V>(array.map((obj) => [obj.id, makeReactive(obj)]));
};

//
export const fromMap = <K, V>(map: Map<K, V>): V[] => {
    return Array.from(map.values() || []);
};

//
export const layout: [number, number] = makeReactive([settings.columns || 4, settings.rows || 8], "grid-layout");
export const size: [number, number] = makeReactive([0, 0], "grid-size");

//
const preLoadState = JSOX.parse(localStorage.getItem("@states") || "{}") || {};

/* TODO: makeObjectAssignable */
export const state: GridsStateType = makeReactive(makeObjectAssignable({
    ...preLoadState,
    grids: toMap(preLoadState.grids || []),
    items: toMap(preLoadState.items || []),
    lists: createReactiveMap<string, Set<string>>()
}), "desktop");

//
export const prepareState = (st: Object | null = null)=>{
    return {
        ...(st || {}),
        grids: Array.from(state.grids?.values?.()) || [],
        items: Array.from(state.items?.values?.()) || []
    };
}

//
const toStorage = (state = {})=>{
    localStorage.setItem("@states", JSOX.stringify(prepareState(state)));
}

//
export const loadState = (st = preLoadState)=>{
    Object.assign(state, {});

    //
    state.grids = toMap(st.grids || []);
    state.items = toMap(st.items || []);

    //
    state.grids.set("backup", {
        id: "backup",
        size: size,
        layout: layout,
        list: []
    });

    //
    state.grids.set("main", state.grids.get("main") || makeReactive({
        id: "main",
        size: size,
        layout: layout,
        list: ["settings", "import", "export", "wallpapers", "github"]
    }));

    //
    state.lists = toMapSet(Array.from(state.grids?.values?.() || []).map((gs: GridPageType) => [gs?.id || "", gs?.list || []]));

    //
    subscribe(state.lists, (v, prop) => {
        const changed = state.grids.get(prop);
        if (changed) {
            changed.list = [...(v?.[extractSymbol] || v || [])];
            state.grids.set(prop, changed);
        }

        //
        toStorage(state);
    });

    //
    state.items.set("import", state.items.get("import") || makeReactive({
        id: "import",
        cell: [2, 0],
        icon: "upload",
        label: "Import Data",
        pointerId: -1,
        action: "import-data",
        href: "#"
    }));

    //
    state.items.set("export", state.items.get("export") || makeReactive({
        id: "export",
        cell: [3, 0],
        icon: "download",
        label: "Export Data",
        pointerId: -1,
        action: "export-data",
        href: "#"
    }));

    //
    state.items.set("settings", state.items.get("settings") || makeReactive({
        id: "settings",
        cell: [0, 0],
        icon: "settings",
        label: "Settings",
        pointerId: -1,
        action: "open-settings"
    }));

    //
    state.items.set("wallpapers", state.items.get("wallpapers") || makeReactive({
        id: "wallpapers",
        cell: [1, 0],
        icon: "wallpaper",
        label: "Wallpapers",
        pointerId: -1,
        action: "open-manager"
    }));

    //
    state.items.set("github", state.items.get("github") || makeReactive({
        id: "github",
        cell: [0, 1],
        icon: "github",
        label: "Our Github",
        pointerId: -1,
        action: "open-link",
        href: "https://github.com/BZ-0/APP.C24B"
    }));

    //
    const ls = state.lists.get("main");
    ls.add("settings");
    ls.add("import");
    ls.add("export");
    ls.add("wallpapers");
    ls.add("github");
    state.lists.set("main", ls);

    //
    toStorage(state);
}

//
loadState(preLoadState);

//
subscribe(settings, (v) => (layout[0] = v), "columns");
subscribe(settings, (v) => (layout[1] = v), "rows");

//
subscribe(size, (v, p) => {for (const gp of state.grids.values()) {gp.size = size;};});
subscribe(layout, (v, p) => {
    for (const gp of state.grids.values()) {gp.layout = layout;};
    toStorage(state);
});

//
subscribe(state.grids, (v, p) => {
    toStorage(state);
});

//
subscribe(state.items, (v, p) => {
    toStorage(state);
});

//
subscribe(state, (v, prop) => {
    toStorage(state);
});

// reactive objects is unable (currently) to as save state, and vue doesn't call state changes
addEventListener("beforeunload", (event) => {
    toStorage(state);
});

//
import("@idc/Core/Event.ts").then((m)=>{
    m?.default?.fire?.("grid-state-loaded", {
        state
    });
});



//
observeBySelector(document.documentElement, ".ui-desktop-grid", (mut)=>{
    const desktop = mut?.addedNodes?.[0];
    const grids: HTMLElement[] = Array.from(desktop?.querySelectorAll(".ui-grid-page") || []);
    grids.forEach((grid)=>{
        observeBorderBox(grid, (box)=>{
            const idc = 0;

            //
            grid?.style?.setProperty?.(["--grid-w", "--grid-h"][idc], size[0] = box.inlineSize, "")
            grid?.style?.setProperty?.(["--grid-h", "--grid-w"][idc], size[1] = box.blockSize, "")
        })
    });
});
