<script setup>
    import {reactive, watch, ref, onMounted, computed } from "vue";

    //
    import stateMap from "@ux-ts/reactive/StateManager.ts";
    import {observeBySelector, observeBorderBox} from "@ux-ts/dom/Observer.ts";
    import {subscribe, safe} from "@ux-ts/reactive/ReactiveLib.ts";

    //
    import GridItem from "./GridItem.vue";
    import GridItemLabel from "./GridItemLabel.vue";
    import { MOCElement } from '@ux-ts/utils/Utils';
    import { objectAssign } from '@ux-ts/reactive/AssignObject';
    import { derivate } from "@ux-ts/reactive/ReactiveLib";

    //
    const props     = defineProps({ state: Object, actionMap: Object });
    const actionMap = props.actionMap || stateMap.get("actionMap");
    const $state    = props.state ?? stateMap.get("desktop");
    const $settings = stateMap.get("settings");

    //
    const state    = derivate($state, reactive);//reactive(safe($state)); // react from vue
    const settings = derivate($settings, reactive);

    //
    const current = ref("main");
    const isItemInList = (id)=>{
        const item = typeof id == "string" ? state.items.get(id) : id;
        const ptr = item.pointerId;
        return $state.lists.get(current.value)?.has?.(item.id) || (ptr != null && ptr >= 0);
    }
    const getItems = (items)=>{ return Array.from(items.values()).filter((item)=>isItemInList(item)); }




    //
    const elRef = ref(null);

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
    const gpRef = ref(null);

    //
    onMounted(()=>{
        if (elRef.value) { stateMap.bindState(elRef.value, $state, ()=>{}) }
        changeLayout();
    });

    //
    changeLayout();



    //
    const wp = localStorage.getItem("@wallpaper") || "./assets/wallpaper/v.webp";
    const items = computed(()=>getItems(state.items));
    const lastShape = settings?.iconShape || 'wavy';
</script>

<!-- -->
<template>
    <canvas is="w-canvas" :data-src="wp"></canvas>
    <div dir="ltr" :key="state" ref="elRef" data-transparent :data-current-page="current" :data-shape="lastShape" data-ctx="grid-space" data-scheme="accent-inverse" class="ui-desktop-grid stretch pe-enable">

        <div dir="ltr" class="ux-grid-layout ui-grid-page" data-transparent>
            <GridItemLabel v-if="items" v-for="item in items" :key="item.id" type="labels" :itemId="item.id"></GridItemLabel>
        </div>

        <div dir="ltr" ref="gpRef" class="ux-grid-layout ui-grid-page" data-transparent>
            <GridItem      v-if="items" v-for="item in items" :key="item.id" type="items"  :itemId="item.id" :onClick="onItemClick"></GridItem>
        </div>
    </div>
</template>
