<script setup>
    import StateManager from '@unite/scripts/reactive/StateManager.ts';
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib.ts';
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from '@idc/UI2/Vue/Decor/WLucideIcon.vue';

    //
    const UIState = StateManager.get("UIState");
    const currentValue = ref(null);
    const currentMenu  = ref(null);

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

    <div v-if="props.menuList" class="ui-drop-menu ui-input" :data-name="props.menuList.menuName" v-bind="$attrs">

        <!-- -->
        <label class="ui-drop-menu" data-scheme="solid" data-chroma="0.05" :data-highlight="(currentMenu == UIState.currentDropMenu) ? 2 : 3" data-highlight-hover="3">
            <button @click="dropMenu">
                <LucideIcon inert :name="props.menuList.items[currentValue]?.icon ?? 'x'" :data-icon="props.menuList.items[currentValue]?.icon ?? 'x'"></LucideIcon>
                <span inert>{{props.menuList.items[currentValue]?.label || 'Not Defined'}}</span>
            </button>
            <input @change="onChange" @input="onChange" v-model="currentValue" :name="props.menuList.menuName" type="text" value=""/>
        </label>

    </div>

</template>
