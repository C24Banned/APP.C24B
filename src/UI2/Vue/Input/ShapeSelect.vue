
<script setup>
    import {reactive, watch, ref, onMounted} from "vue";

    //
    const current = localStorage.getItem("@icon-shape") || "wavy";
    const vib = ()=>requestAnimationFrame(()=>navigator?.vibrate?.([10]));
    const name = ref("shape");

    //
    const shapes = [
        "tear",
        "wavy",
        "circle",
        "square"
    ]
</script>

<template>

    <div v-observe:data-name="(v)=>{name=v}" class="ui-shape-selector ui-input ui-typic-select" v-bind="$attrs" data-scheme="accent" data-transparent>
        <label v-for="shape in shapes" class="ui-select-frame" data-scheme="inverse" data-chroma="0.6" @click="vib" :key="shape">
            <div class="ui-select-bg" data-scheme="solid" data-highlight="4" data-highlight-hover="5" data-chroma="0.1"></div>
            <div class="ui-select-box">
                <div class="ui-shape" :class="{[shape+'-shaped']: true}" data-scheme="inverse" data-chroma="0.6"></div>
            </div>
            <input type="radio" :name="name" :value="shape" :checked="current == shape"></input>
        </label>
    </div>

</template>
