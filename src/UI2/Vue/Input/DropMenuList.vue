<script setup>
    import { StateManager } from '@unite/scripts/reactive/StateManager.ts';
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib.ts';

    //
    const UIState = StateManager.get("UIState");
    const currentMenu = ref(null);

    //
    subscribe(UIState, (v, prop)=>{
        if (prop == "currentDropMenu") { currentMenu.value = v; };
    });

    //
    const whenChange = (ev)=>{
        const radio = ev.target;
        if (radio.checked) {
            const inputWith = document.querySelector("input[name=\""+currentMenu.value.menuName+"\"][type=\"text\"]");
            inputWith.value = radio.value;
            inputWith.dispatchEvent(new Event("change", {
                bubbles: true,
                cancelable: true,
            }));
        }
    }

</script>

<template>

    <div v-if="currentMenu" class="ui-drop-menu-set ui-input" :data-name="currentMenu.menuName" v-bind="$attrs">

        <!-- -->
        <label class="ui-menu-item" v-for="item in currentMenu.items">
            <LucideIcon :key="currentMenu.menuName" :name="item.icon"></LucideIcon>
            <span class="item-label" :key="currentMenu.menuName" >{{item.label}}</span>
            <input :key="currentMenu.menuName" @change="whenChange" @input="whenChange" type="radio" :name="currentMenu.menuName" :value="item.value"/>
        </label>

    </div>

</template>
