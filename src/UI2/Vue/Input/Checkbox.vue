<script setup>
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';
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
            <div data-chroma="0.6" data-highlight="2" data-scheme="inverse" class="active"></div>
            <div data-chroma="0.6" data-highlight="2" data-scheme="solid"   class="in-active"></div>
        </div>
        <div class="thumb" data-scheme="solid-transparent" data-transparent>
            <div data-highlight="2" data-highlight-hover="3" style="--theme-accent-chroma: 0.8;" :data-scheme="checked ? 'inverse' : 'solid'" class="inner"><Icon inert :data-icon="checked ? 'check' : 'x'" :name="checked ? 'check' : 'x'"></Icon></div>
        </div>
    </label>
</template>
