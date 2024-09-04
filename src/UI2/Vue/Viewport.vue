<script setup>
    import {reactive, watch, ref, onMounted, useAttrs} from "vue";
    import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
    import InputEdit from "@idc/UI2/Vue/Overlay/InputEdit.vue";

    //
    const attrs = useAttrs();
</script>

<template>
    <div class="ui-viewport-box">
        <div class="ui-viewport-content"><slot></slot></div>
    </div>
    <InputEdit></InputEdit>
</template>
