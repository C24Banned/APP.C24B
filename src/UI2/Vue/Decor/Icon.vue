<script setup>
    import { computed, onMounted, ref } from 'vue';
    import * as iconPack from "lucide-vue-next";
    import { useAttrs } from 'vue';
    import { observeAttribute } from '@ux-ts/dom/Observer.ts';

    //
    const camelize = (str) => {
        return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    }

    //
    const fup = (str)=>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    //
    const cmz = (str)=>{
        return fup(camelize(str?.trim?.()||""));
    }

    //
    const props = defineProps({
        hook: {
            type: Function,
            default: ()=>{}
        },
        name: {
            type: String,
            required: true
        },
        size: Number,
        color: String,
        strokeWidth: {
            type: Number,
            default: 2
        },
        defaultClass: String
    });

    //
    const target  = ref(null);
    const attrs   = useAttrs();
    const current = ref(null);
    const names   = computed(()=>{ const ns = props.name?.split?.(",")?.map?.((s)=>(s?.trim?.()||""))||[props.name]; current.value = ns[0]; return ns; });

    // reactive attribute...
    current.value = names.value[0];

    //
    onMounted(()=>{
        props?.hook?.(target.value);
    });

</script>

<template>
    <div inert class="icon-wrap" data-transparent :data-icon="names[0]" ref="target" v-observe:data-icon="(v)=>{ current = v; }" v-bind="$attrs">
        <component
            inert
            :is="iconPack[cmz(current)]"
            :size="size"
            :color="color"
            :stroke-width="strokeWidth" :default-class="defaultClass"
            :data-name="current"
            shape-rendering="geometricPrecision"
        />
    </div>
</template>
