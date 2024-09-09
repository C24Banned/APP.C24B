<script setup>
    import StateManager from '@ux-ts/reactive/StateManager.ts';
    import { subscribe } from '@ux-ts/reactive/ReactiveLib.ts';
    import {reactive, watch, ref, shallowRef, onMounted} from "vue";
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';

    //
    const UIState = StateManager.get("UIState");
    const currentValue = ref(null);
    const currentMenu  = shallowRef(null);

    //
    subscribe(UIState, (v, prop)=>{
        if (prop == "currentDropMenu") { currentMenu.value = v; };
    });

    //
    const props = defineProps({
        menuList: Object
    });

    //
    const dropMenu = ()=>{
        UIState.currentDropMenu = UIState.currentDropMenu ? null : props.menuList;
    };

    //
    const onChange = (ev)=>{
        currentValue.value = ev.target.value;
    }

    //
    /*watch(() => currentValue, (newVal, oldVal) => {
    }, {deep: true});*/

</script>

<template>

    <div :style="{'anchorName': (currentMenu == UIState.currentDropMenu) ? '--drop-current' : ''}" v-if="props.menuList" class="ui-drop-menu ui-input" :data-name="props.menuList.menuName" v-bind="$attrs">

        <!-- -->
        <label class="ui-drop-menu" data-scheme="solid" data-chroma="0.05" :data-highlight="(currentMenu == UIState.currentDropMenu) ? 3 : 4" data-highlight-hover="4">
            <button @click="dropMenu">
                <Icon inert :name="props.menuList.items[currentValue]?.icon ?? 'x'" :data-icon="props.menuList.items[currentValue]?.icon ?? 'x'"></Icon>
                <span inert>{{props.menuList.items[currentValue]?.label || 'Not Defined'}}</span>
            </button>
            <input @change="onChange" @input="onChange" v-model="currentValue" :name="props.menuList.menuName" type="text" value=""/>
        </label>

    </div>

</template>
