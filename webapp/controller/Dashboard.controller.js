sap.ui.define([
    "sap/ui/core/mvc/Controller", 
], function (Controller) {
    "use strict";

    return Controller.extend("my.app.controller.Dashboard", {

        onInit: function () { 
            console.log("Dashboard controller loaded");
        }, 
    });
});
