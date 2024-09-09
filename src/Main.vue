<script setup>
    import {shallowRef, defineAsyncComponent} from "vue";
    import { useI18n } from 'vue-i18n'

    //
    import TaskManager from "@idc/PreInit/TaskManager.ts";

    //
    const {t} = useI18n({ useScope: "global" });

    //
    import ContextMenu from "@idc/UI2/Vue/Overlay/ContextMenu.vue";
    import IconEdit from "@idc/UI2/Vue/Overlay/IconEdit.vue";

    //
    import StatusBar from "@idc/UI2/Vue/Tasking/StatusBar.vue";
    import Taskbar from "@idc/UI2/Vue/Tasking/Taskbar.vue";
    import DropMenuList from "@idc/UI2/Vue/Input/DropMenuList.vue";

    //
    import DesktopGrid from "@idc/UI2/Vue/Workspace/DesktopGrid.vue";
    import AppFrame from "@idc/UI2/Vue/Workspace/AppFrame.vue";

    //
    const contextMenus = new Map([
        ["grid-item",
            [{
                icon: "pencil-line",
                name: "Edit Item",
                action: "edit-item",
            }, {
                icon: "badge-x",
                name: "Delete Item",
                action: "delete-item"
            }]],
        ["grid-space",
            [{
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
            }]]
    ]);

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
    <!-- -->
    <DesktopGrid></DesktopGrid>

    <!-- -->
    <AppFrame v-for="task in tasks" :key="task.id" :id="task.id" :tasks="tasks"></AppFrame>

    <!-- -->
    <Taskbar></Taskbar>

    <!-- -->
    <IconEdit></IconEdit>
    <DropMenuList></DropMenuList>
    <ContextMenu :ctxList="contextMenus" data-ctx-name=""></ContextMenu>

    <!-- -->
    <StatusBar></StatusBar>

    <!-- -->
    <x-focustext
        value=""
        id="focustext"
        class="ui-focus ui-mobile-input ui-dedicated"
        data-chroma="0"
        data-scheme="solid"
        data-highlight="1"
    ></x-focustext>
    <div data-hidden="true" data-delay-hide="400" class="ui-tooltip" data-scheme="solid" v-bind="$attrs"></div>
</template>
