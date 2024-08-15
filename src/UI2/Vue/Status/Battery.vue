<script setup>
import LucideIcon from "../WLucideIcon.vue";
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

//
const target = ref(null);
</script>

<!-- -->
<template>
    <LucideIcon name="battery-charging,battery,battery-full,battery-low,battery-medium,battery-warning" :hook="(v)=>{ target = v; }" data-transparent ref="target" class="icon-wrap ui-icon-state ui-battery" data-icon="battery-charging" v-bind="$attrs"></LucideIcon>
</template>
