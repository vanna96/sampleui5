sap.ui.define([
    "sap/ui/core/mvc/Controller", 
], function (Controller) {
    "use strict";

    return Controller.extend("my.app.controller.Dashboard", {

        onInit: function () { 
            document.title = "Dashboard";
            console.log("Dashboard controller loaded");
        }, 
    });
});
