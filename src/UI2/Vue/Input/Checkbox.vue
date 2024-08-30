<script setup>
    import LucideIcon from '@idc/UI2/Vue/Decor/WLucideIcon.vue';
    import {reactive, watch, ref, onMounted} from "vue";

    //
    const input   = ref(null);
    const target  = ref(null);
    const checked = ref(false);

    //
    const onCheck = ()=>{
        checked.value = input.value.checked;
    }
</script>

<!-- -->
<template>
    <label ref="target" class="ui-input ui-checkbox" data-transparent data-scheme="solid-transparent" v-bind="$attrs">
        <input ref="input" data-scheme="solid-transparent" @change="onCheck" @input="onCheck" type="checkbox" v-observe:checked="(v)=>{checked=(v?true:false)}"/>

        <div data-scheme="solid" class="bg">
            <div data-chroma="0.1" data-highlight="1" data-scheme="inverse" class="active"></div>
            <div data-chroma="0.1" data-highlight="1" data-scheme="solid"   class="in-active"></div>
        </div>
        <div class="thumb" data-scheme="solid-transparent" data-transparent>
            <div data-chroma="0.15" data-highlight="2" :data-scheme="checked ? 'inverse' : 'solid'" inert class="inner"><LucideIcon :data-icon="checked ? 'check' : 'x'" :name="checked ? 'check' : 'x'"></LucideIcon></div>
        </div>
    </label>
</template>
