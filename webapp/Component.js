sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/ComponentSupport"
], (UIComponent) => {
    "use strict";
    return UIComponent.extend("my.app.Component", {
        metadata: {
            manifest: "json",
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
        },

        init: function () {
            this._oSplitApp = this.byId("splitAppControl");
            UIComponent.prototype.init.apply(this, arguments);
            const oRouter = this.getRouter();
            oRouter.initialize();

            oRouter.attachRouteMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const oRouter = this.getRouter();
            const sRouteName = oEvent.getParameter("name");

            if (sRouteName === "login" && this._checkAuthentication()) {
                oRouter.navTo("dashboard");
            } else if (sRouteName !== "login" && !this._checkAuthentication()) {
                oRouter.navTo("login");
            }
        },

        _handleAuthentication: function (oRouter) {
            if (!this._checkAuthentication()) {
                oRouter.navTo("login");
            }
        },

        _checkAuthentication: function () {
            const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith("B1SESSION="));
            return authCookie !== undefined;
        },
    });
});
