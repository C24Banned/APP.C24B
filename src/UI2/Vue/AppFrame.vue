<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import LucideIcon from './WLucideIcon.vue';
    import TaskManager from "@idc/PreInit/TaskManager.ts";

    //
    const target = ref(null);
    const props = defineProps({
        tasks: {type: Array, default: []},
        id: {type: String, default: "#app"}
    });
    const isActive = ref(location.hash == props.id);

    //
    const task = ()=>{
        return props.tasks.find((t)=>(t.id==props.id));
    }

    //
    TaskManager.on("*", ()=>{
        const idx = props.tasks.findIndex((t)=>(t.id == props.id));
        target?.value?.style?.setProperty?.("--z-index", idx, "");
    });

    //
    const toTask = ()=>{
        if (currentHash.value == props.id) {
            TaskManager.addTask(task());
        }
    }

    // vue has poor reactivity in such cases
    const currentHash = ref(location.hash); toTask();
    addEventListener("popstate"  , (event) => { currentHash.value = location.hash; toTask(); });
    addEventListener("hashchange", (event) => { currentHash.value = location.hash; toTask(); });

    //
    const toFocus = (ev)=>{ TaskManager.focus(props.id); }
    TaskManager.on("*", ()=>{ isActive.value = task().active; });
    //TaskManager.addTask(task, false);
</script>

<!-- -->
<template>
    <div @pointerdown="toFocus" ref="target" :data-hidden="!isActive" :data-id="props.id" data-scheme="solid" class="ui-frame ui-app-frame ui-default-theme ui-detached" v-bind="$attrs">

        <div class="ui-titlebar" data-highlight="3" data-scheme="accent" style="--theme-accent-chroma: 0.9;">
            <button data-bg-dep class="back-button" type="button"><LucideIcon name="chevron-down" style="grid-column: back-button; aspect-ratio: 1 / 1;" /></button>
            <div data-bg-dep data-transparent data-scheme="solid-transparent" class="ui-title-handle"></div>
            <!--<LucideIcon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" />-->
        </div>

        <!--<slot></slot>-->
        <component :key="props.id" :id="props.id" :is="task().content" data-instant></component>

        <!-- -->
        <div class="ui-status" data-scheme="solid" data-highlight="2.5"></div>
        <div class="ui-resize"></div>
    </div>
</template>
