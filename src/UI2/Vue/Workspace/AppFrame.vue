<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
    import TaskManager from "@idc/PreInit/TaskManager.ts";
    import { zoomOf } from "@ux-ts/utils/Zoom.ts";

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
    TaskManager.on("*", ()=>{ isActive.value = task()?.active || false; });
    //TaskManager.addTask(task, false);

    //
    const maximized = ref(true);
    const toggleMaximize = ()=>{
        const old = target.value.getAttribute("data-maximized");
        //target.value.setAttribute("data-maximized", (!old || old == "false") ? true : false);
        maximized.value = !maximized.value;

        //
        requestAnimationFrame(()=>{
            if (target.value) {
                const f = target.value;
                f.style.setProperty("--drag-x", (f.parentNode.clientWidth - Math.min(Math.max(f.offsetWidth, 48*16), f.parentNode.clientWidth)) * (zoomOf() / 2), "");
                f.style.setProperty("--drag-y", (f.parentNode.clientHeight - Math.min(Math.max(f.offsetHeight, 32*16), f.parentNode.clientHeight)) * (zoomOf() / 2), "");
            }
        });
    }


</script>

<!-- -->
<template>
    <div @pointerdown="toFocus" ref="target" :data-maximized="maximized" :data-hidden="!isActive" :data-id="props.id" data-highlight="3" data-scheme="solid" style="--theme-accent-chroma: 0.9;" class="ui-frame ui-app-frame ui-default-theme" v-bind="$attrs">

        <div class="ui-titlebar" data-transparent>
            <button scheme="dynamic-transparent" data-transparent class="max-button" type="button" style="grid-column: max-button; aspect-ratio: 1 / 1;" @click="toggleMaximize"><Icon name="maximize-2"/></button>
            <button scheme="dynamic-transparent" data-transparent class="back-button" type="button" style="grid-column: back-button; aspect-ratio: 1 / 1;"><Icon name="chevron-down"/></button>
            <div data-scheme="dynamic-transparent" data-transparent class="ui-title-handle"></div>
            <!--<Icon name="menu" class="menu-button" style="grid-column: menu-button; aspect-ratio: 1 / 1;" />-->
        </div>

        <!--<slot></slot>-->
        <component :key="props.id" :id="props.id" :is="task().content" data-instant data-scheme="solid"></component>

        <!-- -->
        <div class="ui-status" data-transparent data-scheme="solid"></div>
        <div class="ui-resize" data-transparent ></div>
    </div>
</template>
