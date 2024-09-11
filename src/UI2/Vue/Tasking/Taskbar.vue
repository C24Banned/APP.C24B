<script setup>
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';
    import {reactive, watch, ref, onMounted, computed} from "vue";
    import stateMap from "@ux-ts/reactive/StateManager.ts";
    import { subscribe } from '@ux-ts/reactive/ReactiveLib';

    //
    import Signal from "@idc/UI2/Vue/Status/Signal.vue";
    import Battery from "@idc/UI2/Vue/Status/Battery.vue";
    import Time from "@idc/UI2/Vue/Status/Time.vue";
    import Github from "@idc/UI2/Vue/Status/Github.vue";

    //
    import TaskManager from "@idc/PreInit/TaskManager.ts";
    import {MOC, MOCElement} from "@ux-ts/utils/Utils.ts";

    //
    const UIState = stateMap.get("UIState");
    const tasks  = ref([...TaskManager.tasks]);

    //
    TaskManager.on("*", ()=> { tasks.value = [...TaskManager.tasks]; });

    //
    const focusTask = (ev)=>{
        const target = ev.target;
        if (TaskManager.inFocus(target.dataset.id) && !matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= #{$mobileWidth}) or (orientation: landscape)))").matches) {
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
        //ev.stopImmediatePropagation();
        UIState.taskPanelOpen = !UIState.taskPanelOpen;
    }

    //
    document.documentElement.addEventListener("click", (ev)=>{
        if (!MOC(".ui-task-panel, .menu-button, .back-button, .ui-navbar")) {
            UIState.taskPanelOpen = false;
            requestAnimationFrame(()=>navigator?.vibrate?.([10]))
        }

        // mobile switch fix
        if (MOC(".ui-tab-item") && !matchMedia("(((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches) {
            UIState.taskPanelOpen = false;
            requestAnimationFrame(()=>navigator?.vibrate?.([10]))
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
            //ev.stopImmediatePropagation();
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
            <Icon data-transparent inert data-place="icon" :name="task.icon"/>
            <span data-transparent inert class="tab-label">{{task.label||""}}</span>
            <Icon data-transparent inert data-place="element" name="chevron-right"/>
        </div>
    </x-scrollbox>

    <!-- -->
    <div class="ui-taskbar" v-bind="$attrs" data-scheme="solid">
        <div data-tooltip="Not implemented" class="ui-app-menu" data-highlight-hover="2" data-transparent data-scheme="dynamic-transparent">
            <Icon inert name="layout-grid"></Icon>
        </div>
        <div class="ui-task-bar" data-transparent data-scheme="dynamic-transparent">
            <div v-for="task in tasks"
                :class="{'ui-focus': task.id == currentHash, 'ui-active': task.active}"
                :key="task.id"
                :style="{'order': task.order||0}"
                class="ui-task"
                :data-id="task.id"
                data-highlight-hover="1"
                data-transparent
                @click="focusTask"
            >
                <Icon inert :name="task.icon"></Icon>
            </div>
        </div>
        <div class="ui-status" data-transparent data-scheme="dynamic-transparent">
            <Github data-tooltip="Our Github Repository" data-highlight="1" data-highlight-hover="2" style="pointer-events: auto;"></Github>
            <Signal data-tooltip="Not implemented" data-highlight="1" data-highlight-hover="2"></Signal>
            <Battery data-tooltip="Not implemented" data-highlight="1" data-highlight-hover="2"></Battery>
            <Time data-tooltip="Not implemented" data-highlight="1" data-highlight-hover="2"></Time>
        </div>
    </div>

    <!-- -->
    <div class="ui-navbar" data-scheme="solid" data-highlight="2" v-bind="$attrs">
        <button data-transparent data-scheme="dynamic-transparent" class="back-button" style="grid-column: back-button; aspect-ratio: 1 / 1;"><Icon name="chevron-down"/></button>
        <div class="ui-title-handle" @pointerdown="toFocus">{{ label }}</div>
        <button data-transparent data-scheme="dynamic-transparent" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" @click="openPanel"><Icon name="menu"/></button>
    </div>

</template>
