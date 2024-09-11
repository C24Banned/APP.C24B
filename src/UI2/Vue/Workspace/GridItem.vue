<script setup>
    import GestureControl from "@ux-ts/interact/Gesture.ts";
    import {reactive, watch, ref, onMounted} from "vue";
    import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
    import {subscribe, safe, derivate} from "@ux-ts/reactive/ReactiveLib.ts";
    import { objectAssign } from '@ux-ts/reactive/AssignObject';
    import stateMap from "@ux-ts/reactive/StateManager.ts";

    //
    const props  = defineProps({
        state: Object,
        itemId: String,
        onClick: Function,
        type: String
    });

    //
    const state = props.state ?? stateMap.get("desktop");
    const gridItem = derivate(state.items.get(props.itemId), reactive);
    subscribe(state, (items)=>{ objectAssign(gridItem, items.get(props.itemId), null, true) }, "items");

    //
    const elRef = ref(null);
    watch(() => gridItem?.cell, (newVal, oldVal)=>{
        elRef.value?.style?.setProperty?.("--cell-x", (newVal?.[0] || 0), "")
        elRef.value?.style?.setProperty?.("--cell-y", (newVal?.[1] || 0), "")
    }, {deep: true})

    //
    onMounted(()=>{
        //
        if (elRef.value) {
            const gest = new GestureControl(elRef.value);
            gest.longPress({
                handler: elRef.value.querySelector(".ui-item-design"),
                anyPointer: true,
                mouseImmediate: true,
                minHoldTime: 60 * 3600,
                maxHoldTime: 100
            });
        }

        //
        elRef.value?.style?.setProperty?.("--cell-x", (gridItem?.cell?.[0] || 0), "")
        elRef.value?.style?.setProperty?.("--cell-y", (gridItem?.cell?.[1] || 0), "")
    });

</script>

<template>

    <div
        v-if="gridItem?.id"
        :data-id="gridItem?.id"
        :data-action="gridItem?.action"
        :data-href="gridItem?.href"
        :data-type="props?.type"
        :data-dragging="gridItem?.pointerId >= 0"
        class="ux-grid-item"
        ref="elRef"
        data-ctx="grid-item"
    >
        <div
            class="ui-item-design"
            @click="(ev)=>{props.onClick(ev);}"
            data-scheme="accent-inverse"
            :data-tooltip="gridItem?.href">

            <Icon inert :name="gridItem.icon" :data-icon="gridItem.icon"></Icon>

        </div>
    </div>

</template>
