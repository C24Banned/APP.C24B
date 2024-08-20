<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from './WLucideIcon.vue';
    import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

    //
    const target = ref(null);

    //
    TaskManager.on("*", ()=>{
        const idx = TaskManager.tasks.findIndex((t)=>(t.id == task.id));
        target?.value?.style?.setProperty?.("--z-index", idx, "");
    });

    //
    const props = defineProps({
        hashIdName: {type: String, default: "#app"},
        icon: {type: String, default: "settings"},
        label: {type: String, default: ""}
    });

    //
    const isActive = ref(location.hash == props.hashIdName);

    //
    const task = {
        get label() { return props.label },
        get id() { return props.hashIdName },
        get icon() { return props.icon },
        active: false
    };

    //
    const toTask = ()=>{
        if (currentHash.value == props.hashIdName) {
            TaskManager.addTask(task);
        }
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash); toTask();

    addEventListener("popstate", (event) => {
        currentHash.value = location.hash; toTask();
    });

    addEventListener("hashchange", (event) => {
        currentHash.value = location.hash; toTask();
    });

    //
    const toFocus = (ev)=>{
        TaskManager.focus(props.hashIdName);
    }

    //
    TaskManager.on("*", ()=>{
        isActive.value = task.active;
    });

    //
    TaskManager.addTask(task, false);
</script>

<!-- -->
<template>
    <div @pointerdown="toFocus" ref="target" :data-hidden="!isActive" data-scheme="solid" class="ui-frame ui-app-frame ui-default-theme ui-detached" v-bind="$attrs">

        <div class="ui-titlebar" data-highlight="3" data-scheme="solid">
            <button class="back-button" type="button"><LucideIcon name="chevron-down" style="grid-column: back-button; aspect-ratio: 1 / 1;" /></button>
            <div data-transparent data-scheme="solid-transparent" class="ui-title-handle"></div>
            <!--<LucideIcon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" />-->
        </div>

        <slot></slot>

        <div class="ui-status" data-scheme="solid" data-highlight="2.5"></div>
        <div class="ui-resize"></div>
    </div>
</template>
