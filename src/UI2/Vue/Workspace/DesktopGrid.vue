<script setup>
    import {reactive, watch, ref, onMounted, computed } from "vue";

    //
    import stateMap from "@unite/scripts/reactive/StateManager.ts";
    import {observeBySelector, observeBorderBox} from "@unite/scripts/dom/Observer.ts";
    import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";

    //
    import GridItem from "./GridItem.vue";
    import GridItemLabel from "./GridItemLabel.vue";
    import { MOCElement } from '@unite/scripts/utils/Utils';
    import { objectAssign } from '@unite/scripts/reactive/AssignObject';

    //
    const props     = defineProps({ state: Object, actionMap: Object });
    const actionMap = props.actionMap || stateMap.get("actionMap");
    const pState    = props.state ?? stateMap.get("desktop");

    //
    const current   = ref("main");

    //
    const isItemInList = (id)=>{
        const item = typeof id == "string" ? pState.items.get(id) : id;
        const ptr = item.pointerId;
        return pState.lists.get(current.value)?.has?.(item.id) || (ptr != null && ptr >= 0);
    }
    const getItems = (items)=>{ return Array.from(items.values()).filter((item)=>isItemInList(item)); }

    //
    const state = reactive({...pState}); // react from vue
    subscribe(pState, (v,p)=>{ if (state[p] !== v) { state[p] = v; }}); // react to vue
    //watch(() => state, (newVal, oldVal) => { for (const k in newVal) { if (pState[k] !== newVal[k]) { objectAssign(pState, k, newVal[k]); } } }, {deep: true});

    // read-only, skip ir-reactivity...
    const $settings = stateMap.get("settings");
    const settings = reactive({...$settings});
    subscribe($settings, (v,p)=>(settings[p] = v));

    //
    const elRef = ref(null);
    const gpRef = ref(null);

    //
    const changeLayout = ()=>{
        elRef.value?.style?.setProperty?.("--layout-c", settings.columns, "")
        elRef.value?.style?.setProperty?.("--layout-r", settings.rows, "")
    }

    //
    subscribe($settings, (value, prop)=>{
        changeLayout();
    });

    //
    const onItemClick = (ev)=>{
        const actionEl = MOCElement(ev.target, ".ux-grid-item[data-action]");
        actionMap?.get?.(actionEl.dataset.action)?.({
            initiator: actionEl
        });
        requestAnimationFrame(()=>navigator?.vibrate?.([10]))
    }

    //
    changeLayout();

    //
    onMounted(()=>{
        if (gpRef.value) {
            stateMap.bindState(elRef.value, pState, ()=>{})
            observeBorderBox(gpRef.value, (box)=>{
                const idc = 0;

                //
                Array.from(pState.grids.values()).map((g)=>{
                    g.size = [box.inlineSize, box.blockSize];
                });

                //
                gpRef.value?.style?.setProperty?.(["--grid-w", "--grid-h"][idc], box.inlineSize, "")
                gpRef.value?.style?.setProperty?.(["--grid-h", "--grid-w"][idc], box.blockSize, "")
            })
        }

        //
        changeLayout();
    });

    //
    const wp = localStorage.getItem("@wallpaper") || "./assets/wallpaper/v.webp";

    // native VUE reactivity doesn't supported here...
    const items = ref(getItems(state.items));
    subscribe(pState, (v,p)=>{ if (state[p] !== v) {
        items.value = getItems(state.items);
    }}, "items")

    //
    const lastShape = settings?.iconShape || 'wavy';
</script>

<!-- -->
<template>
    <canvas is="w-canvas" :data-src="wp"></canvas>
    <div dir="ltr" :key="state" ref="elRef" data-transparent :data-current-page="current" :data-shape="lastShape" data-ctx="grid-space" data-scheme="accent-inverse" class="ui-desktop-grid stretch grid-based-box pe-enable">

        <div dir="ltr" class="ux-grid-layout ui-grid-page" data-transparent>
            <GridItemLabel v-if="items" v-for="item in items" :key="item.id" type="labels" :gridItem="pState.items.get(item.id)"></GridItemLabel>
        </div>

        <div dir="ltr" ref="gpRef" class="ux-grid-layout ui-grid-page" data-transparent>
            <GridItem v-if="items" v-for="item in items" :key="item.id" type="items" :onClick="onItemClick" :gridItem="pState.items.get(item.id)"></GridItem>
        </div>
    </div>
</template>
