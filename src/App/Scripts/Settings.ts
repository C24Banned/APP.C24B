import { observeBySelector } from "@unite/scripts/dom/Observer.ts";
import stateMap from "@unite/scripts/reactive/StateManager.ts";

//
export default async ()=>{

    //
    const onChange = (ev)=>{
        const input  = ev.target;
        const target = input.closest(".ui-input");
        const state  = stateMap.get(target?.dataset?.state);

        //
        if (state) {
            if (input.matches("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])")) {
                state[target.dataset.name] = input.valueAsNumber ?? input.value;
            }

            // any radio-box
            if (input?.matches("input[type=\"radio\"]:checked")) {
                state[target.dataset.name] = input.value;
            }

            // any check-box
            if (input?.matches("input[type=\"checkbox\"]")) {
                state[target.dataset.name] = input.checked;
            }
        }
    };

    //
    document.documentElement.addEventListener("input", onChange);
    document.documentElement.addEventListener("change", onChange);

    //
    const updateInput = (target)=>{
        const input = target.querySelector("input:where([type=\"text\"], [type=\"number\"], [type=\"range\"])");
        const state = stateMap.get(target?.dataset?.state);
        if (state && input) {
            input.value = state[target?.dataset?.name];
            input.dispatchEvent(new Event("change", { bubbles: false, cancelable: true, }))
        }

        // setup radio boxes
        if (state) {
            const radio = target.querySelector("input:where([type=\"radio\"][name=\""+target?.dataset?.name+"\"][value=\""+state[target?.dataset?.name]+"\"])");
            if (state && radio) { radio?.click?.(); };
        }

        // setup check boxes
        const checkbox = target.querySelector("input:where([type=\"checkbox\"][name=\""+target?.dataset?.name+"\"]");
        if (state && checkbox) {
            checkbox.checked = !!state[target?.dataset?.name];
            checkbox.dispatchEvent(new Event("change", { bubbles: false, cancelable: true, }))
        }
    }

    //
    observeBySelector(document.documentElement, ".ui-input", (mutations)=>{
        mutations.addedNodes.forEach((target)=>{
            updateInput(target);
        });
    });

    //
    document.documentElement.addEventListener("ux-appear", ()=>{
        document.querySelectorAll(".ui-input").forEach((target)=>{
            updateInput(target);
        });
    });
}
