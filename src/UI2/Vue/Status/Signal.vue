<script setup>
import LucideIcon from "../WLucideIcon.vue";
import { pickFromCenter } from '@unite/scripts/stylework/ColorTheme';
import { ref } from "vue";

//
const target = ref(null);
</script>

<!-- -->
<template>
    <LucideIcon name="wifi,wifi-off,wifi-high,wifi-low,wifi-zero" data-transparent :hook="(v)=>{ target = v; }" class="icon-wrap ui-icon-state ui-network" data-icon="wifi" v-bind="$attrs"></LucideIcon>
</template>
