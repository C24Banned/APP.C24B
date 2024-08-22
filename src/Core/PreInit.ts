const preInit = async ()=>{
    return [
        import("@idc/PreInit/TaskManager.ts"),
        import("@idc/PreInit/ActionMap.ts"),
        import("@idc/PreInit/CurrentState.ts"),
        import("@idc/PreInit/GridState.ts"),
    ];
};

//
export default preInit;
