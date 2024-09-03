<script setup>
import Frame from '@idc/UI2/Vue/Overlay/Frame.vue';
import Icon from '@idc/UI2/Vue/Decor/Icon.vue';
import {reactive, watch, ref, onMounted} from "vue";

//
const props = defineProps({
    ctxList: Object
});

//
const ctxName = ref("");

</script>

<template>
    <Frame id="context-menu" v-observe:data-ctx-name="(v)=>{ ctxName = v }" class="ui-modal-frame ui-context-menu" v-bind="$attrs">
        <div v-for="L in props.ctxList.get(ctxName)" data-scheme="solid-transparent" class="ui-block-decor ui-ctx-item" data-highlight-hover="2" style="--decor-size: 3rem" :data-action="L.action">
            <Icon :name="L.icon" data-place="icon"></Icon>
            <span>{{L.name}}</span>
            <div data-place="element"></div>
        </div>
    </Frame>
</template>
