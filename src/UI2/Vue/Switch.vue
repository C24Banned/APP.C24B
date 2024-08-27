<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted} from "vue";

    //
    import RangeTouch from 'rangetouch';
    import stateMap from "@unite/scripts/reactive/StateManager.ts";

    //
    const input  = ref(null);
    const target = ref(null);

    //
    const whenChange = (ev)=>{
        const inp = ev.target;
        (target.value).style.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    }

    //
    onMounted(()=>{
        const inp = input.value;
        (target.value).style.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    });

</script>

<!-- -->
<template>
    <label ref="target" class="ui-input ui-switch" data-scheme="solid-transparent" v-bind="$attrs">
        <input ref="input" data-scheme="solid-transparent" @change="whenChange" @input="whenChange" type="range" min="-1" max="1" step="1"/>
        <div data-chroma="0.2" data-scheme="inverse" data-highlight="4" class="fill" ></div>
        <div data-scheme="solid"  data-highlight="2" class="track" ></div>
        <div data-chroma="0.05" data-scheme="solid"  data-highlight="3" class="thumb icon-sign"><LucideIcon name="circle"/></div>
    </label>
</template>
