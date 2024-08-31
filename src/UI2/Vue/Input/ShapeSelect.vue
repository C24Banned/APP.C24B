
<script setup>
    const current = localStorage.getItem("@icon-shape") || "wavy";
    const vib = ()=>requestAnimationFrame(()=>navigator?.vibrate?.([10]));
</script>

<template>

    <div class="ui-shape-selector ui-input" v-bind="$attrs" data-scheme="accent" data-transparent>
        <label class="ui-shape-frame" data-scheme="inverse" @click="vib">
            <div class="ui-shape-bg" data-scheme="solid" data-highlight="4" data-highlight-hover="5"></div>
            <div class="wavy-shaped ui-shape" data-scheme="inverse" style="--theme-accent-chroma: 0.6;">
                <input type="radio" name="shape" value="wavy" :checked="current == 'wavy'"></input>
            </div>
        </label>
        <label class="ui-shape-frame" data-scheme="inverse" @click="vib">
            <div class="ui-shape-bg" data-scheme="solid" data-highlight="4" data-highlight-hover="5"></div>
            <div class="tear-shaped ui-shape" data-scheme="inverse" style="--theme-accent-chroma: 0.6;">
                <input type="radio" name="shape" value="tear" :checked="current == 'tear'"></input>
            </div>
        </label>
        <label class="ui-shape-frame" data-scheme="inverse" @click="vib">
            <div class="ui-shape-bg" data-scheme="solid" data-highlight="4" data-highlight-hover="5"></div>
            <div class="circle-shaped ui-shape" data-scheme="inverse" style="--theme-accent-chroma: 0.6;">
                <input type="radio" name="shape" value="circle" :checked="current == 'circle'" ></input>
            </div>
        </label>
        <label class="ui-shape-frame" data-scheme="inverse" @click="vib">
            <div class="ui-shape-bg" data-scheme="solid" data-highlight="4" data-highlight-hover="5"></div>
            <div class="square-shaped ui-shape" data-scheme="inverse">
                <input type="radio" name="shape" value="square" :checked="current == 'square'"></input>
            </div>
        </label>
    </div>

</template>
