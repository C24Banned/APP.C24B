<script setup>
import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
import { ref } from "vue";

//
const target = ref(null);
</script>

<!-- -->
<template>
    <div
        ref="target" class="ui-indicator ui-icon"
        data-transparent
        data-scheme="dynamic-transparent"
        v-bind="$attrs">
        <Icon
            color-scheme="dynamic-transparent"
            name="wifi,wifi-off,wifi-high,wifi-low,wifi-zero"
            class="icon-wrap ui-icon-state ui-network"
            data-transparent
            data-icon="wifi"
            :hook="(v)=>{ target = v; }"
        ></Icon>
    </div>
</template>
