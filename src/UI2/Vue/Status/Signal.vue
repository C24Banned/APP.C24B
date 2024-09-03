<script setup>
import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

//
const target = ref(null);
</script>

<!-- -->
<template>
    <div data-transparent ref="target" class="ui-indicator" color-scheme="dynamic-transparent" v-bind="$attrs">
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
