<script setup>
    import {reactive, watch, ref, onMounted, shallowRef, shallowReactive, markRaw} from "vue";

    //
    import ItemEdit from "@idc/UI2/Vue/Input/ItemEdit.vue";
    import Frame from "@idc/UI2/Vue/Overlay/Frame.vue";
    import stateMap from "@ux-ts/reactive/StateManager.ts";
    import {subscribe} from "@ux-ts/reactive/ReactiveLib.ts";

    //
    const gridItem = ref(null); //shallowRef(null); // you can't use full reactivity due stack exceeded issues...
    const editor   = ref(null);

    //
    const UIState   = stateMap.get("UIState");
    const actionMap = stateMap.get("actionMap");

    //
    subscribe(UIState, (v)=>{
        gridItem.value = v;
        if (gridItem.value && editor.value) {
            editor.value.dataset.hidden = false;
        }
    }, "itemOnEdit");

    //
    const confirm = ref(null);
    const setConfirm = (fx)=>{ confirm.value = fx; };

    //
    const confirmWrap = (ev) => {
        confirm.value?.(); gridItem.value = null;

        //
        requestAnimationFrame(()=>{
            document.activeElement?.blur?.();
        });
    }
    const deleteWrap = (ev)=>{
        actionMap.get("delete-item")?.({
            initiator: document.querySelector(`.ux-grid-item[data-type=\"items\"][data-id=\"${gridItem.value?.id||""}\"]`)
        });

        //
        requestAnimationFrame(()=>{
            document.activeElement?.blur?.();
        });
    }

    //
    const hookRef = (v)=>{ editor.value = v; };
    const fieldSet = [
        {"name": "label", "label": "Label: ", "icon": "", "value": ""},
        {"name": "icon", "label": "IconID: ", "icon": "", "value": ""},
        {"name": "action", "label": "Action: ", "icon": "", "value": ""},
        {"name": "href", "label": "HREF: ", "icon": "", "value": ""},
    ];
</script>

<!-- -->
<template>
    <Frame :self="hookRef" class="ui-modal-frame ui-icon-edit">
        <ItemEdit :whatEdit="gridItem" :data-item="gridItem?.id" :fields="fieldSet" v-bind:setConfirm="setConfirm" :key="gridItem"></ItemEdit>
        <div class="ui-but">
            <button data-scheme="accent" type="button" class="delete-btn" @click="deleteWrap">Delete Icon</button>
            <button data-scheme="accent" type="button" class="confirm-btn" @click="confirmWrap">Apply Change</button>
        </div>
    </Frame>
</template>
