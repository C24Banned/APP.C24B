<script setup>
    import {shallowRef, defineAsyncComponent} from "vue";
    import { useI18n } from 'vue-i18n'
    import TaskManager from "@idc/PreInit/TaskManager.ts";

    //
    const {t} = useI18n({ useScope: "global" });

    //
    import ContextMenu from "@idc/UI2/Vue/ContextMenu.vue";
    import InputEditor from "@idc/UI2/Vue/InputEdit.vue";
    import Viewport from "@idc/UI2/Vue/Viewport.vue";
    import IconEdit from "@idc/UI2/Vue/IconEdit.vue";

    //
    import StatusBar from "@idc/UI2/Vue/StatusBar.vue";
    import Taskbar from "@idc/UI2/Vue/Taskbar.vue";

    //
    import DesktopGrid from "@idc/UI2/Vue/DesktopGrid.vue";
    import AppFrame from "@idc/UI2/Vue/AppFrame.vue";

    //
    const itemCtxList = [{
        icon: "pencil-line",
        name: "Edit Item",
        action: "edit-item",
    }, {
        icon: "badge-x",
        name: "Delete Item",
        action: "delete-item"
    }];

    //
    const gridCtxList = [{
        icon: "badge-plus",
        name: "Add Item",
        action: "add-item"
    }, {
        icon: "wallpaper",
        name: "Wallpaper",
        action: "open-manager"
    }, {
        icon: "settings",
        name: "Settings",
        action: "open-settings"
    }, {
        icon: "fullscreen",
        name: "Fullscreen",
        action: "fullscreen"
    }];

    //
    const tasks = shallowRef([
        {
            id: "#settings",
            content: defineAsyncComponent(() => import("@idc/App/Vue/Settings.vue")),
            label: t('tasks.settings'),
            icon: "settings"
        },
        {
            id: "#manager",
            content: defineAsyncComponent(() => import("@idc/App/Vue/Manager.vue")),
            label: t('tasks.wallpapers'),
            icon: "wallpaper"
        }
    ]);

    //
    TaskManager.addTasks(tasks, false);
    TaskManager.on("*", ()=>{ tasks.value = TaskManager.tasks; });

</script>

<!-- -->
<template>

<Viewport>
    <DesktopGrid></DesktopGrid>

    <!-- -->
    <AppFrame v-for="task in tasks" :key="task.id" :id="task.id" :tasks="tasks"></AppFrame>

    <!-- -->
    <IconEdit></IconEdit>
    <Taskbar></Taskbar>
</Viewport>

<StatusBar></StatusBar>

<div data-hidden="true" class="ui-tooltip" data-scheme="solid" v-bind="$attrs"></div>

<ContextMenu :ctxList="itemCtxList" ctxName="grid-item"></ContextMenu>
<ContextMenu :ctxList="gridCtxList" ctxName="grid-space"></ContextMenu>

</template>

