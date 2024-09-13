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
            name="battery-charging,battery,battery-full,battery-low,battery-medium,battery-warning"
            class="icon-wrap ui-icon-state ui-battery"
            data-transparent
            data-icon="battery-charging"
            :hook="(v)=>{ target = v; }"
        ></Icon>
    </div>
</template>
