<script setup>
    import {reactive, watch, ref, onMounted} from "vue";
    import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
    import {subscribe} from "@unite/scripts/reactive/ReactiveLib.ts";
    import { objectAssign } from '@unite/scripts/reactive/AssignObject';


    //
    const props = defineProps({
        fields: Array,
        whatEdit: Object,
        setConfirm: Function
    });

    //
    const whatEdit = reactive({...props.whatEdit});
    subscribe(props.whatEdit, (v,p)=>{ if (whatEdit[p] !== v) { whatEdit[p] = v; } }) // react to vue
    watch(() => whatEdit, (newVal, oldVal) => { for (const k in newVal) { if (props.whatEdit[k] !== newVal[k]) { objectAssign(props.whatEdit, k, newVal[k]); } } }, {deep: true});
    // please, save such pattern for future!

    //
    const fields = reactive([...props.fields]);
    subscribe(props.fields, (v,p)=>{ if (state[p] !== v) { fields[p] = v; } }); // react to vue
    watch(() => fields, (newVal, oldVal) => { for (const k in newVal) { if (props.fields[k] !== newVal[k]) { objectAssign(props.fields, k, newVal[k]); } } }, {deep: true});

    //
    let elRef = ref(null);

    //
    const confirm = ()=>{
        if (props.whatEdit) {
            for (const F of fields) {
                if (F.name in whatEdit) {
                    props.whatEdit[F.name] = F.value;
                };
            }
        }
    }

    //
    if (props.setConfirm) {
        props.setConfirm(confirm);
    }

    //
    const synchronize = (whatFrom)=>{
        //
        /*if (whatFrom && whatFrom != whatEdit) {
            whatEdit = whatFrom;
        }*/

        //
        if (props.whatEdit) {
            for (const F of fields) {
                if (F.name in props.whatEdit) {
                    F.value = props.whatEdit[F.name];
                };
            }
        }
    }

    //
    onMounted(()=>{
        /*observeBySelector(elRef.value, ".ui-field-block", ()=>{
            synchronize();
        });*/

        //
        synchronize();
    });

    //@change="confirm"
</script>

<!-- -->
<template>
    <form ref="elRef" class="ui-edit-form" autocomplete="off">
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
