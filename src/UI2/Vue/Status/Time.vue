<script setup>
import { pickFromCenter } from '@ux-ts/stylework/ColorTheme';
import { ref } from "vue";

const target = ref(null);
</script>

<!-- -->
<template>
    <div data-transparent ref="target" class="ui-indicator ui-time" color-scheme="dynamic-transparent" v-bind="$attrs"><span class="ui-time-hour" inert>00</span>:<span class="ui-time-minute" inert>00</span></div>
</template>
