
<script setup>
    const current = localStorage.getItem("@icon-shape") || "wavy";
    const vib = ()=>requestAnimationFrame(()=>navigator?.vibrate?.([10]));
</script>

<template>

    <div class="ui-shape-selector ui-input" v-bind="$attrs">
        <div class="ui-shape-frame" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="vib">
            <label class="wavy-shaped ui-shape" data-highlight="1">
                <input type="radio" name="shape" value="wavy" :checked="current == 'wavy'"></input>
            </label>
        </div>
        <div class="ui-shape-frame" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="vib">
            <label class="tear-shaped ui-shape" data-highlight="1">
                <input type="radio" name="shape" value="tear" :checked="current == 'tear'"></input>
            </label>
        </div>
        <div class="ui-shape-frame" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="vib">
            <label class="circle-shaped ui-shape">
                <input type="radio" name="shape" value="circle" :checked="current == 'circle'" ></input>
            </label>
        </div>
        <div class="ui-shape-frame" data-scheme="solid-transparent" data-highlight="1" data-highlight-hover="2" @click="vib">
            <label class="square-shaped ui-shape">
                <input type="radio" name="shape" value="square" :checked="current == 'square'"></input>
            </label>
        </div>
    </div>

</template>
