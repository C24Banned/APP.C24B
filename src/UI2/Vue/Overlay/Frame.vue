<script setup>
    import {reactive, watch, ref, onMounted} from "vue";

    //
    const FocusSelector = ".ui-modal-frame, .ui-modal, .ui-editor, input, button";
    const DNBSelector = "input[type=\"text\"], .ui-editor, input, button";

    //
    const props = defineProps({ self: Function });
    const elRef = ref(null);

    //
    document.addEventListener("click", (ev)=>{
        const target = ev.target;
        const modalFrame = elRef.value;

        //
        if (!(modalFrame == target || target.matches(FocusSelector) || target.closest(FocusSelector)) && !(document?.activeElement?.matches(DNBSelector) || target.matches(DNBSelector) || target.closest(DNBSelector)) || target.matches(".ui-modal-frame button")) {
            if (modalFrame) {
                modalFrame.dataset.hidden = true;
            }
        }
    });

    //
    onMounted(() => {
        props?.self?.(elRef.value);
    });

</script>

<template>
    <div dir="ltr" ref="elRef" data-hidden="true" class="ui-modal-frame" data-scheme="solid" v-bind="$attrs">
        <div class="cut-space">
            <slot></slot>
        </div>
    </div>
</template>
