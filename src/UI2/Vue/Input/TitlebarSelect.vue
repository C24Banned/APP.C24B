
<script setup>
    const current = localStorage.getItem("@icon-shape") || "wavy";
    const vib = ()=>requestAnimationFrame(()=>navigator?.vibrate?.([10]));
</script>

<template>

    <div class="ui-shape-selector ui-input" v-bind="$attrs" data-scheme="accent" data-transparent>
        <label class="ui-shape-frame ui-win" data-scheme="inverse" @click="vib">
            <input type="radio" name="shape" value="win" :checked="current == 'win'"></input>
            <div class="ui-select-bg"></div>

            <div class="ui-select-label">
                <Icon class="text" name="layout-grid"></Icon>
                <div  class="label">Win-Style</div>
            </div>

            <div class="ui-select-decor">
                <Icon class="icon" name="settings"></Icon>
                <div>TitleBar</div>
                <Icon class="icon" name="chevron-down"></Icon>
            </div>

        </label>
        <label class="ui-shape-frame ui-mac" data-scheme="inverse" @click="vib">
            <input type="radio" name="apple" value="mac" :checked="current == 'apple'"></input>
            <div class="ui-select-bg"></div>

            <div class="ui-select-label">
                <Icon class="text" name="layout-grid"></Icon>
                <div  class="label">Mac-Style</div>
            </div>

            <div class="ui-select-decor">
                <Icon class="icon" name="settings"></Icon>
                <div>TitleBar</div>
                <Icon class="icon" name="chevron-down"></Icon>
            </div>
        </label>
    </div>

</template>
