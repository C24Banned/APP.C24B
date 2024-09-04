<script setup>
    import StateManager from '@unite/scripts/reactive/StateManager.ts';
    import { subscribe } from '@unite/scripts/reactive/ReactiveLib.ts';
    import {reactive, watch, ref, shallowRef, onMounted} from "vue";
    import Icon from '@idc/UI2/Vue/Decor/Icon.vue';
    import { fixedClientZoom } from "@unite/scripts/utils/Zoom.ts";

    //
    const UIState      = StateManager.get("UIState");
    const currentMenu  = shallowRef(null);
    const currentValue = ref(document.querySelector("input[type=\"text\"][name=\""+currentMenu.value?.menuName+"\"]")?.value);
    const target       = ref(null);

    //
    subscribe(UIState, (v, prop)=>{
        if (prop == "currentDropMenu") { currentMenu.value = v; };
    });

    //
    const whenChange = (ev)=>{
        const radio = ev.target;
        if (radio.checked && currentMenu.value) {
            const inputWith = document.querySelector("input[name=\""+currentMenu.value?.menuName+"\"][type=\"text\"]");
            inputWith.value = radio.value;
            inputWith.dispatchEvent(new Event("change", {
                bubbles: true,
                cancelable: true,
            }));
        }
    }

    //
    watch(currentMenu, (newVal, oldVal) => {
        requestAnimationFrame(()=>{
            if (currentMenu.value) {
                const dropWith = document.querySelector(".ui-input[data-name=\""+currentMenu.value?.menuName+"\"]");
                const bbox = dropWith.getBoundingClientRect();

                //
                /*if (!CSS.supports("anchor-name", "--carter")) {
                    target.value.style.insetInlineStart = `calc(${(bbox.left   * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
                    target.value.style.insetBlockStart  = `calc(${(bbox.bottom * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
                    target.value.style.inlineSize       = `calc(${(bbox.width  * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
                }*/
            }
        });
    });

    //
    document.addEventListener("scroll", ()=>{
        if (currentMenu.value) {
            const dropWith = document.querySelector(".ui-input[data-name=\""+currentMenu.value?.menuName+"\"]");
            const bbox = dropWith.getBoundingClientRect() * fixedClientZoom();

            //
            /*if (!CSS.supports("anchor-name", "--carter")) {
                target.value.style.insetInlineStart = `calc(${(bbox.left   * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
                target.value.style.insetBlockStart  = `calc(${(bbox.bottom * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
                target.value.style.inlineSize       = `calc(${(bbox.width  * fixedClientZoom()) + "px"} / var(--zoom, 1))`;
            };*/
        }
    });

    //
    document.addEventListener("click", (ev)=>{
        const target = ev.target;

        //
        if (target.matches(".ui-drop-menu-list .ui-menu-item")) {
            requestAnimationFrame(()=>{
                UIState.currentDropMenu = null;
            });
        }
    });

    //
    document.addEventListener("pointerdown", (ev)=>{
        const target = ev.target;

        //
        if (!target.matches(".ui-drop-menu-list .ui-menu-item, .ui-drop-menu, .ui-drop-menu button")) {
            requestAnimationFrame(()=>{
                UIState.currentDropMenu = null;
            });
        }
    });

    //
    document.addEventListener("change", (ev)=>{
        if (ev.target.matches("input[type=\"text\"][name=\""+currentMenu.value?.menuName+"\"]")) {
            currentValue.value = ev.target.value;
        }
    });

    // try also when mounted
    onMounted(()=>{
        requestAnimationFrame(()=>{
            currentValue.value = document.querySelector("input[type=\"text\"][name=\""+currentMenu.value?.menuName+"\"]")?.value;
        });
    });
</script>

<template>

    <div data-scheme="solid" data-highlight="2" v-if="currentMenu" class="ui-drop-menu-list ui-input" :data-name="currentMenu?.menuName" v-bind="$attrs" ref="target">

        <!-- -->
        <label v-for="item in currentMenu.items" data-highlight="1.5" data-highlight-hover="3" class="ui-menu-item">
            <Icon inert :key="currentMenu.menuName" :name="item.icon"></Icon>
            <span inert class="item-label" :key="currentMenu.menuName" >{{item.label}}</span>
            <input :key="currentMenu.menuName" @change="whenChange" @input="whenChange" type="radio" :name="currentMenu.menuName" :value="item.value"/>
            <div class="space"></div>
            <div class="indicator" data-scheme="inverse" :class="{'selected': currentValue == item.value}"></div>
        </label>

    </div>

</template>
