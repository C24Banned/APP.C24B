const preInit = async ()=>{
    return [
        import("@idc/PreInit/TaskManager.ts"),
        import("@idc/PreInit/ActionMap.ts"),
        import("@idc/PreInit/CurrentState.ts"),
        import("@idc/PreInit/GridState.ts"),

        //
        import("@unite/wcomp/scrollbox/ScrollBox.ts"),
        import("@unite/wcomp/flexlike/FlexLike.ts"),
        import("@unite/wcomp/longtext/FocusText.ts"),
        import("@unite/wcomp/longtext/LongText.ts")
    ];
};

//
export default preInit;
