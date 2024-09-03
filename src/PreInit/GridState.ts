import {JSOX} from 'jsox';

//
import {makeReactive, createReactiveSet, createReactiveMap} from "@unite/scripts/reactive/ReactiveLib.ts";
import {makeObjectAssignable} from "@unite/scripts/reactive/AssignObject.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts"
import {subscribe, extractSymbol} from "@unite/scripts/reactive/ReactiveLib.ts";

//
import {settings} from "./CurrentState.ts";

//
import type {GridItemType, GridsStateType, GridPageType} from "@unite/grid/GridItemUtils.ts";

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
    return createReactiveMap<K, V>(list.map((obj) => [obj.id, makeReactive(obj)]));
};

//
export const fromMap = <K, V>(map: Map<K, V>): V[] => {
    return Array.from(map.values() || []);
};

//
export const layout: [number, number] = makeReactive([settings.columns || 4, settings.rows || 8], "grid-layout");
export const size: [number, number] = makeReactive([0, 0], "grid-size");

/* TODO: makeObjectAssignable */
export const state: GridsStateType = makeReactive(makeObjectAssignable({
    grids: toMap(JSOX.parse(localStorage.getItem("@gridsState") || "[]")),
    items: toMap(JSOX.parse(localStorage.getItem("@itemsState") || "[]")),
    lists: createReactiveMap<string, Set<string>>()
}), "desktop");

//
subscribe(settings, (v) => (layout[0] = v), "columns");
subscribe(settings, (v) => (layout[1] = v), "rows");
subscribe(size, (v, p) => {for (const gp of state.grids.values()) {gp.size = size;};});
subscribe(layout, (v, p) => {
    for (const gp of state.grids.values()) {gp.layout = layout;};
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
});

//
subscribe(state.grids, (v, p) => {
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids.values())));
});

//
subscribe(state.items, (v, p) => {
    localStorage.setItem("@itemsState", JSOX.stringify(Array.from(state.items.values())));
});

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
    list: ["settings", "import", "export", "wallpapers"]
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
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids?.values() || v)));
});

//
subscribe(state, (v, prop) => {
    if (prop == "grids") localStorage.setItem("@gridsState", JSOX.stringify(Array.from(v?.values() || v)));
    if (prop == "items") localStorage.setItem("@itemsState", JSOX.stringify(Array.from(v?.values() || v)));
});

//
state.items.set("import", state.items.get("import") || makeReactive({
    id: "import",
    cell: [0, 0],
    icon: "upload",
    label: "Import Data",
    pointerId: -1,
    action: "import-data",
    href: "#"
}));

//
state.items.set("export", state.items.get("export") || makeReactive({
    id: "export",
    cell: [1, 0],
    icon: "download",
    label: "Export Data",
    pointerId: -1,
    action: "export-data",
    href: "#"
}));


//
state.items.set("settings", state.items.get("settings") || makeReactive({
    id: "settings",
    cell: [2, 0],
    icon: "settings",
    label: "Settings",
    pointerId: -1,
    action: "open-settings",
    href: "#control-center"
}));


//
state.items.set("wallpapers", state.items.get("wallpapers") || makeReactive({
    id: "wallpapers",
    cell: [3, 0],
    icon: "wallpaper",
    label: "Wallpapers",
    pointerId: -1,
    action: "open-manager",
    href: "#control-center"
}));

//
const ls = state.lists.get("main");
ls.add("settings");
ls.add("import");
ls.add("export");
ls.add("wallpapers");
state.lists.set("main", ls);

// reactive objects is unable (currently) to as save state, and vue doesn't call state changes
addEventListener("beforeunload", (event) => {
    localStorage.setItem("@gridsState", JSOX.stringify(Array.from(state.grids?.values() || v)));
    localStorage.setItem("@itemsState", JSOX.stringify(Array.from(state.items?.values() || v)));
});

//
import("@idc/Core/Event.ts").then((m)=>{
    m?.default?.fire?.("grid-state-loaded", {
        state
    });
});
