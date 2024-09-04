
<script setup>
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';

    //
    const current = localStorage.getItem("@icon-shape") || "wavy";
    const vib = ()=>requestAnimationFrame(()=>navigator?.vibrate?.([10]));

    //
    const types = [
        {
            style: 'win',
            label: "Win-Style",
            icon: 'layout-grid'
        },
        {
            style: 'mac',
            label: "Mac-Style",
            icon: 'apple'
        }
    ]
</script>

<template>

    <div class="ui-titlebar-select ui-input ui-typic-select" v-bind="$attrs" data-scheme="accent" data-transparent>
        <label v-for="t in types" class="ui-select-frame" data-scheme="inverse" @click="vib">
            <input type="radio" name="titlebar" value="win" :checked="current == 'win'"></input>
            <div class="ui-select-bg" data-scheme="solid" data-highlight="3" data-highlight-hover="4" data-chroma="0.1"></div>

            <div class="ui-select-box" data-scheme="solid-transparent">

                <div class="ui-select-decor" data-highlight="4" :class="{['ui-' + t.style]: true}">
                    <Icon style="grid-column: icon;" class="icon" name="settings"></Icon>
                    <div  style="grid-column: title;" class="title">TitleBar</div>
                    <Icon style="grid-column: button;" class="icon" name="chevron-down"></Icon>
                </div>

                <div class="ui-select-label">
                    <Icon class="text" :name="t.icon"></Icon>
                    <div  class="label">{{ t.label }}</div>
                </div>
            </div>

        </label>
    </div>

</template>
