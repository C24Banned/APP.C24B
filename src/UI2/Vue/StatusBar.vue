<script setup>
import {reactive, watch, ref, onMounted} from "vue";

//
import Signal from "./Status/Signal.vue";
import Battery from "./Status/Battery.vue";
import Time from "./Status/Time.vue";

//
document.documentElement.addEventListener("contextmenu", (ev)=>{
	const target = ev.target;
	if ((target?.matches?.(".ui-status-bar") || target?.closest?.(".ui-status-bar"))) {
		ev.stopPropagation();
		ev.stopImmediatePropagation();
		ev.preventDefault();
	}
}, {capture: true});

</script>

<!-- -->
<template>
    <div class="ui-status-bar" data-scheme="transparent" data-transparent>
        <div class="left">
            <Time data-scheme="dynamic-transparent"></Time>
        </div>
        <div class="center"></div>
        <div class="right">
            <Signal data-scheme="dynamic-transparent"></Signal>
            <Battery data-scheme="dynamic-transparent"></Battery>
        </div>
    </div>
</template>
