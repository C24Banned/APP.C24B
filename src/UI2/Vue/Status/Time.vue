<script setup>
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

const target = ref(null);
</script>

<!-- -->
<template>
    <div data-transparent ref="target" class="ui-time" color-scheme="" v-bind="$attrs"><span class="ui-time-hour">00</span>:<span class="ui-time-minute">00</span></div>
</template>
