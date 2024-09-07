<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
    import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";
    import { objectAssign } from '@unite/scripts/reactive/AssignObject';
    import { derivate } from "@unite/scripts/reactive/ReactiveLib";

    //
    const props = defineProps({
        fields: Array,
        whatEdit: Object,
        setConfirm: Function
    });

    //
    const whatEdit = derivate(props.whatEdit, reactive, watch);
    const fields = derivate(props.fields, reactive, watch);

    //
    let elRef = ref(null);
    const confirm = ()=>{
        for (const F of fields) {
            if (F.name in props.whatEdit) {
                props.whatEdit[F.name] = F.value;
            };
        }
    }

    //
    props?.setConfirm?.(confirm);
    const synchronize = (whatFrom)=>{
        if (whatEdit) {
            for (const F of fields) {
                if (F.name in whatEdit) {
                    F.value = whatEdit[F.name];
                };
            }
        }
    }

    //
    onMounted(()=>synchronize());
</script>

<!-- -->
<template>
    <form ref="elRef" class="ui-edit-form" autocomplete="off" v-bind="$attrs">
        <div class="ui-edit-desc">
            <slot name="description"/>
        </div>
        <div class="ui-field-block" v-for="F in fields">
            <div inert class="field-label">{{F.label}}</div>
            <input
                data-scheme="solid"
                class="field-input hl-1 hl-2h"
                data-highlight="1"
                data-highlight-hover="2"
                type="text"
                maxlength="1024"
                autocomplete="off"
                v-model="F.value"
                :name="F.name"
                :data-name="F.name"
                />
        </div>
    </form>
</template>
