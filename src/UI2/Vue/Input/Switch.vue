<script setup>
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';
    import {reactive, watch, ref, onMounted} from "vue";

    //
    import RangeTouch from 'rangetouch';
    import stateMap from "@unite/scripts/reactive/StateManager.ts";

    //
    const input  = ref(null);
    const target = ref(null);
    const value  = ref(0);

    //
    const iconSet = new Map([
        [-1, "moon"],
        [0, "sun-moon"],
        [1, "sun"],
    ]);

    //
    const whenChange = (ev)=>{
        const inp = ev.target;
        value.value = inp.valueAsNumber;
        (target.value)?.style?.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    }

    //
    onMounted(()=>{
        const inp = input.value;
        value.value = inp.valueAsNumber;
        (target.value)?.style?.setProperty("--value-mod", (inp.valueAsNumber - inp.min) / (inp.max - inp.min), "");
    });

</script>

<!-- -->
<template>
    <label ref="target" class="ui-input ui-switch" data-transparent data-scheme="solid-transparent" v-bind="$attrs">
        <input ref="input" data-scheme="solid-transparent" @change="whenChange" @input="whenChange" type="range" value="0" min="-1" max="1" step="1"/>

        <div data-scheme="solid" class="bg">
            <div data-chroma="0.6" data-highlight="2" data-scheme="inverse" class="active"></div>
            <div data-chroma="0.6" data-highlight="2" data-scheme="solid"   class="in-active"></div>
        </div>
        <div class="thumb" data-scheme="solid-transparent" data-transparent>
            <div data-highlight="3" data-highlight-hover="4" style="--theme-accent-chroma: 0.8;" :data-scheme="'solid'" inert class="inner">
                <Icon
                    :data-icon="iconSet.get(value) || 'circle'"
                    :name="iconSet.get(value) || 'circle'"
                ></Icon>
            </div>
        </div>
    </label>
</template>


