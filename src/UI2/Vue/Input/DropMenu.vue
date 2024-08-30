<script setup>
    import { StateManager } from '@unite/scripts/reactive/StateManager.ts';
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib.ts';

    //
    const UIState = StateManager.get("UIState");
    const currentValue = ref(null);

    //
    const props = defineProps({
        menuList: Object
    });

    //
    const dropMenu = ()=>{
        UIState.currentDropMenu = props.menuList;
    };

    //
    /*watch(() => currentValue, (newVal, oldVal) => {
    }, {deep: true});*/

</script>

<template>

    <div class="ui-drop-menu ui-input" :data-name="props.menuList.menuName" v-bind="$attrs">

        <!-- -->
        <label class="ui-drop-menu" v-for="item in currentMenu.items" >
            <button @click="dropMenu">{{menuList.items[currentValue].label}}</button>
            <input v-model="currentValue" :name="menuList.menuName" type="text" value=""/>
        </label>

    </div>

</template>
