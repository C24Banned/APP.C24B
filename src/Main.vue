<script setup>
    import "@idc/State/CurrentState.ts";
    import "@idc/State/ActionMap.ts";
    import "@idc/State/GridState.ts";

    //
    import ContextMenu from "@idc/UI2/Vue/ContextMenu.vue";
    import InputEditor from "@idc/UI2/Vue/InputEdit.vue";
    import Viewport from "@idc/UI2/Vue/Viewport.vue";
    import IconEdit from "@idc/UI2/Vue/IconEdit.vue";

    //
    import StatusBar from "@idc/UI2/Vue/StatusBar.vue";
    import Taskbar from "@idc/UI2/Vue/Taskbar.vue";

    //
    import Manager from "@idc/App/Vue/Manager.vue";
    import Settings from "@idc/App/Vue/Settings.vue";

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
</script>

<!-- -->
<template>

<Viewport>
    <DesktopGrid></DesktopGrid>

    <AppFrame hashIdName="#settings" icon="settings" :label="$t('tasks.settings')">
        <Settings data-instant></Settings>
    </AppFrame>

    <AppFrame hashIdName="#manager" icon="wallpaper" :label="$t('tasks.wallpapers')">
        <Manager data-instant></Manager>
    </AppFrame>

    <IconEdit></IconEdit>
    <Taskbar></Taskbar>
</Viewport>

<StatusBar></StatusBar>

<div data-hidden="true" class="ui-tooltip" data-scheme="solid" v-bind="$attrs"></div>

<ContextMenu :ctxList="itemCtxList" ctxName="grid-item"></ContextMenu>
<ContextMenu :ctxList="gridCtxList" ctxName="grid-space"></ContextMenu>

</template>

