sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function (Controller) {
    "use strict";

    return Controller.extend("my.app.controller.Category", {

        onInit: function () {
            document.title = "Category";
            console.log("Category controller loaded");
        },
    });
});
