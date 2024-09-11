<script setup>
import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
import { pickFromCenter } from '@ux-ts/stylework/ColorTheme';
import { ref } from "vue";

//
const target = ref(null);
</script>

<!-- -->
<template>
    <div data-transparent ref="target" class="ui-indicator" color-scheme="dynamic-transparent" v-bind="$attrs">
        <a href="https://github.com/BZ-0/APP.C24B" target="_blank"><Icon
            inert
            color-scheme="dynamic-transparent"
            name="github"
            class="icon-wrap ui-icon-state ui-github"
            data-transparent
            data-icon="github"
            :hook="(v)=>{ target = v; }"
        ></Icon></a>
    </div>
</template>
