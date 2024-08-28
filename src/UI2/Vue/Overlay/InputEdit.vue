<script setup>
    import {reactive, watch, ref, onMounted, useAttrs} from "vue";
    import LucideIcon from "@idc/UI2/Vue/Decor/WLucideIcon.vue";

    //
    const attrs = useAttrs();
</script>

<template>
    <div
        class="ui-editor fixed"
        data-hidden="true"
        data-scheme="solid"
        v-bind="$attrs"
        style="grid-row: field-edit;"
    >
        <input
            autofocus
            autocomplete="off"
            type="text"
            maxlength="1024"
            data-scheme="solid"
        />
        <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-copy pe-enable" style="grid-row: 1 / 1; grid-column: 2 / 2;">
            <LucideIcon name="copy" tabindex="-1" inert></LucideIcon>
        </button>
        <button type="button" tabindex="-1" data-scheme="solid" data-highlight="2" class="field-paste pe-enable" style="grid-row: 1 / 1; grid-column: 3 / 3;">
            <LucideIcon name="clipboard" tabindex="-1" inert></LucideIcon>
        </button>
    </div>
</template>

<!-- TEST ONLY! -->
<!--<input type="text" name="text" />
<input type="text" name="text" />-->
