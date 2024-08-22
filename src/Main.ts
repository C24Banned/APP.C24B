import Boot from "@idc/Core/Boot.ts";
import Event from "@idc/Core/Event.ts";
import App from "@idc/Core/App.ts";
import PreInit from "@idc/Core/PreInit.ts";

//
Boot.addSystem([
    import("@idc/Core/Event.ts")
]);

//
Boot.addPreInit(await PreInit());

//
Boot.boot().then(async ()=>{
    return App();
});
