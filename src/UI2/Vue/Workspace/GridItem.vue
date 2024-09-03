<script setup>
import GestureControl from "@unite/scripts/interact/Gesture.ts";
import {reactive, watch, ref, onMounted} from "vue";
import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";
import { objectAssign } from '@unite/scripts/reactive/AssignObject';

//
const props = defineProps({
    gridItem: Object,
    onClick: Function,
    type: String
});

// bad mine, be accurate!
const gridItem = reactive({...props.gridItem}); // react from vue
subscribe(props.gridItem, (v,p)=>{ if (gridItem[p] !== v) { gridItem[p] = v; } }); // react to vue
// any react from external property will react to vue.
// any react from vue will "do" react in external (except no strict change, due avoid "stack exceeded" issue)

// but due `gridItem` is copy, just re-set back into property object (and avoid recursions)...
watch(() => gridItem, (newVal, oldVal) => { for (const k in newVal) { if (props.gridItem[k] !== newVal[k]) { objectAssign(props.gridItem, k, newVal[k]); } } }, {deep: true});
// please, save such pattern for future!

//
const elRef = ref(null);

//
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
        :data-id="gridItem.id"
        :data-action="gridItem.action"
        :data-href="gridItem.href"
        :data-type="props.type"
        :data-dragging="gridItem.pointerId >= 0"
        class="ux-grid-item"
        ref="elRef"
        data-ctx="grid-item"
    >
        <div
            class="ui-item-design"
            @click="(ev)=>{props.onClick(ev);}"
            data-scheme="accent-inverse">

            <Icon inert :name="gridItem.icon" :data-icon="gridItem.icon"></Icon>

        </div>
    </div>

</template>
