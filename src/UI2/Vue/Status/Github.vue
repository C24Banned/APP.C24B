<script setup>
import Icon from "@idc/UI2/Vue/Decor/Icon.vue";
import { ref } from "vue";
import { MOCElement } from "@unite/scripts/utils/Utils";
import actionMap from "@idc/PreInit/ActionMap";

//
const target = ref(null);

//
const onItemClick = (ev)=>{
    const actionEl = MOCElement(ev.target, "*[data-action]");
    actionMap?.get?.(actionEl.dataset.action)?.({
        initiator: actionEl
    });
    requestAnimationFrame(()=>navigator?.vibrate?.([10]))
}

</script>

<!-- -->
<template>
    <div
        @click="onItemClick"
        ref="target" class="ui-indicator ui-icon ui-github"
        data-transparent
        data-scheme="dynamic-transparent"
        v-bind="$attrs"
        data-action="open-link"
        data-href="https://github.com/BZ-0/APP.C24B">
        <Icon
            inert
            color-scheme="dynamic-transparent"
            name="github"
            class="icon-wrap ui-icon-state ui-github"
            data-transparent
            data-icon="github"
            :hook="(v)=>{ target = v; }"
        ></Icon>
    </div>
</template>
