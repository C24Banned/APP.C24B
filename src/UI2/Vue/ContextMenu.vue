<script setup>
import Frame from "./Frame.vue";
import LucideIcon from "./WLucideIcon.vue";
import {reactive, watch, ref, onMounted} from "vue";

//
const props = defineProps({
    ctxName: String,
    ctxList: Array
});

//
/*export let ctxName = "ctx-menu";
export let ctxList = [{
    icon: "wallpaper",
    name: "Test",
    action: "unknown"
}];*/
</script>

<template>
    <Frame :data-ctx-name="props.ctxName" class="ui-modal-frame ui-context-menu">
        <div v-for="L in props.ctxList" data-scheme="solid-transparent" class="ui-block-decor ui-ctx-item" data-highlight-hover="2" style="--decor-size: 3rem" :data-action="L.action">
            <LucideIcon :name="L.icon" data-place="icon"></LucideIcon>
            <span>{{L.name}}</span>
            <div data-place="element"></div>
        </div>
    </Frame>
</template>
