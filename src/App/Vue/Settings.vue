<script setup>
    import LucideIcon from '@idc/UI2/Vue/WLucideIcon.vue';
    import { lang } from "@idc/Config/Config.ts";

    //
    import { useI18n } from "vue-i18n";
    const { t } = useI18n({ useScope: "global" });

    //
    import Number from '@idc/UI2/Vue/Number.vue';
    import Switch from '@idc/UI2/Vue/Switch.vue';
    import ShapeSelect from '@idc/UI2/Vue/ShapeSelect.vue';

    //
    import { state, layout, size } from "@idc/State/GridState.ts";
    import { settings } from "@idc/State/CurrentState.ts";

    //
    const props = defineProps({
        stateName: { type: String, default: "settings" },
        ifc: Boolean
    });

    //
    const forms = [
        {
            description: t('settings.grid_layout_desc'),
            fields: [
                {label: t('settings.columns'), icon: "columns-3", type: "number", params: [4, 6, 1], name: "columns"}, 
                {label: t('settings.rows'), icon: "rows-3", type: "number", params: [8, 12, 1], name: "rows"}, 
            ]
        },
        {
            description: t('settings.display_desc'),
            fields: [
                {label: t('settings.scaling'), icon: "scaling", type: "number", params: [0.5, 1.5, 0.125], name: "scaling"}, 
                {label: t('settings.theme'), icon: "sun-moon", type: "switch", params: [-1, 1, 1], name: "theme"}, 
            ]
        },
        {
            description: t('settings.design_desc'),
            fields: [
                {label: t('settings.iconShape'), icon: "badge", type: "shape", name: "iconShape"},
            ]
        }
    ]

</script>

<!-- -->
<template>
    <div class="ui-title-label">
        <LucideIcon inert name="settings" class="ui-icon"/>
        <span>{{ "Settings" }}</span>
    </div>

    <div class="ui-screen ui-content" id="settings" v-bind="$attrs" data-transparent data-scheme="solid-transparent">

        <div class="ui-nav" data-scheme="solid" data-highlight="2.5">
            <div class="f-space"></div>
            <button class="back-act hl-1 hl-2h" data-tooltip="Back" data-scheme="solid-transparent" data-transparent data-highlight-hover="1">
                <LucideIcon inert slot="icon" name="arrow-left" class="icon"/>
            </button>
        </div>

        <!--<div class="ui-tab-panel">
        </div>-->

        <x-scrollbox class="ui-space">

            <div is="flex-like" data-gap="16">
                <div data-scheme="solid" data-highlight="1" v-if="forms" v-for="form in forms" data-page class="form-wrap">
                    <div class="form-description">{{form.description}}</div>
                    <div v-if="form.fields" v-for="field in form.fields" class="ui-block-decor pe-none" :class="{'layout-alt': field.type == 'shape'}" style="--decor-size: 4rem;" >
                        <span class="opt-label">{{field.label}}</span>
                        <LucideIcon data-place="icon" :name="field.icon"/>

                        <div data-place="element">
                            <Number v-if="field.type == 'number'"
                                :min="field.params[0]"
                                :max="field.params[1]"
                                :step="field.params[2]"
                                :data-state="props.stateName"
                                :data-name="field.name"
                            ></Number>

                            <Switch v-if="field.type == 'switch'"
                                :data-state="props.stateName"
                                :data-name="field.name"
                            ></Switch>

                            <ShapeSelect v-if="field.type == 'shape'"
                                :data-state="props.stateName"
                                :data-name="field.name"
                            ></ShapeSelect>
                        </div>
                    </div>
                </div>
            </div>

        </x-scrollbox>

    </div>
</template>
