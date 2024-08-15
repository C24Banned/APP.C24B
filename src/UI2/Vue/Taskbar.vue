<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted, computed} from "vue";
    import stateMap from "@unite/scripts/reactive/StateManager.ts";
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib';

    //
    import Signal from "./Status/Signal.vue";
    import Battery from "./Status/Battery.vue";
    import Time from "./Status/Time.vue";

    //
    import TaskManager from "@idc/UI2/Scripts/TaskManager.ts";

    //
    const UIState = stateMap.get("UIState");
    const tasks  = ref([...TaskManager.tasks]);

    //
    TaskManager.on("*", ()=> { tasks.value = [...TaskManager.tasks]; });

    //
    const focusTask = (ev)=>{
        const target = ev.target;
        if (TaskManager.inFocus(target.dataset.id) && !matchMedia("(width < 9in) or (orientation: portrait)").matches) {
            TaskManager.deactivate(target.dataset.id);
        } else {
            TaskManager.focus(target.dataset.id);
        }
        requestAnimationFrame(()=>navigator?.vibrate?.([10]))
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash);

    addEventListener("hashchange", (event) => {
        currentHash.value = location.hash;
    });

    addEventListener("popstate", (event) => {
        currentHash.value = location.hash;
    });

    //
    const panelOpened = ref(false);
    const openPanel = (ev)=>{
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        UIState.taskPanelOpen = !UIState.taskPanelOpen;
    }

    //
    document.documentElement.addEventListener("click", (ev)=>{
        if (!ev.target.matches(".ui-task-panel, .menu-button, .back-button, .ui-navbar")) {
            UIState.taskPanelOpen = false;
            //requestAnimationFrame(()=>navigator?.vibrate?.([10]))
        }
    });

    //
    subscribe(UIState, (v)=>{ panelOpened.value = v; }, "taskPanelOpen");

    //
    const label = computed(()=> (tasks.value.find((t)=>t.id==currentHash.value)?.label || "") );

    //
    addEventListener("ui-back", (ev)=>{
        if (UIState.taskPanelOpen) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
            history.go(1);
        };
        UIState.taskPanelOpen = false;
    });
</script>

<!-- -->
<template>
    <x-scrollbox data-scheme="solid" class="ui-task-panel" :data-hidden="!panelOpened">
        <div
            v-for="task in tasks"
            style="--decor-size: 4rem;" class="ui-block-decor ui-tab-item"
            data-highlight-hover="2" @click="focusTask"
            :style="{'order': task.order||0}"
            :class="{'ui-focus': task.id == currentHash, 'ui-active': task.active}"
            :data-scheme="task.id == currentHash ? 'inverse' : 'solid-transparent'"
            :data-id="task.id"
            :key="task.id">
            <LucideIcon inert data-place="icon" :name="task.icon" data-transparent/>
            <span data-transparent inert class="tab-label">{{task.label||""}}</span>
            <LucideIcon inert data-place="element" name="chevron-right" data-transparent/>
        </div>
    </x-scrollbox>

    <!-- -->
    <div class="ui-taskbar" v-bind="$attrs" data-scheme="transparent">
        <div class="ui-app-menu" data-highlight-hover="2" data-transparent data-bg-dep>
            <LucideIcon inert name="layout-grid"></LucideIcon>
        </div>
        <div class="ui-task-bar" data-transparent data-bg-dep>
            <div v-for="task in tasks"
                :class="{'ui-focus': task.id == currentHash, 'ui-active': task.active}"
                :key="task.id"
                :style="{'order': task.order||0}"
                class="ui-task"
                :data-id="task.id"
                data-highlight-hover="1"
                data-transparent data-bg-dep
                @click="focusTask"
            >
                <LucideIcon inert :name="task.icon"></LucideIcon>
            </div>
        </div>
        <div class="ui-status" data-transparent>
            <Signal data-bg-dep data-highlight="1" data-highlight-hover="2"></Signal>
            <Battery data-bg-dep data-highlight="1" data-highlight-hover="2"></Battery>
            <Time data-bg-dep data-highlight="1" data-highlight-hover="2"></Time>
        </div>
    </div>

    <!-- -->
    <div class="ui-navbar" data-scheme="solid" data-highlight="2" v-bind="$attrs">
        <LucideIcon data-scheme="dynamic-transparent" name="chevron-down" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;" />
        <div class="ui-title-handle" @pointerdown="toFocus">{{ label }}</div>
        <LucideIcon data-scheme="dynamic-transparent" name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" @click="openPanel"/>
    </div>


</template>
