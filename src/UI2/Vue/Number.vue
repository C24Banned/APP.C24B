<script setup>
import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
import stateMap from "@unite/scripts/reactive/StateManager.ts";

//
import {reactive, watch, ref, onMounted} from "vue";

//
const input = ref(null);
const target = ref(null);

//
const props = defineProps({
    min: Number,
    max: Number,
    step: Number
});

//
const whenClickDown = ()=>{
    input.value?.stepDown?.();
    input.value?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
    requestAnimationFrame(()=>navigator?.vibrate?.([10]))
}

//
const whenClickUp = ()=>{
    input.value?.stepUp?.();
    input.value?.dispatchEvent(new Event("input", { bubbles: true, cancelable: true, }))
    requestAnimationFrame(()=>navigator?.vibrate?.([10]))
}

onMounted(() => {
    //state.value = stateMap.get(target.dataset.state);
});

</script>

<template>
    <div ref="target" data-scheme="accent" class="ui-input number-input" v-bind="$attrs" data-highlight="1" style="--theme-accent-chroma: 0.2;">
        <button data-bg-dep type="button" @click="whenClickDown" class="icon-wrap f-minus" data-scheme="accent" data-highlight="1" data-highlight-hover="2" style="--theme-accent-chroma: 0.8;">
            <LucideIcon data-bg-dep inert name="chevron-left"/>
        </button>
        <div class="input-wrap hl-ms" data-scheme="solid-transparent" data-transparent>
            <input
                data-transparent
                data-scheme="solid-transparent"
                ref="input"
                :min="props.min"
                :max="props.max"
                :step="props.step"
                inert
                type="number"
                inputmode="numeric"
                pattern="\d*"
                virtualkeyboardpolicy="manual"
                data-bg-dep
            />
        </div>
        <button data-bg-dep type="button" @click="whenClickUp" class="icon-wrap f-plus" data-scheme="accent" data-highlight="1" data-highlight-hover="2" style="--theme-accent-chroma: 0.8;">
            <LucideIcon data-bg-dep inert name="chevron-right"/>
        </button>
    </div>
</template>
