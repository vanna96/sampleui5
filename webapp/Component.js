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
            // Check for authentication cookie (for example, "userAuth" cookie)
            if (!this._checkAuthentication()) {
                // If not authenticated, navigate to the login route
                oRouter.navTo("login");
            }
        },

        _checkAuthentication: function () {
            // Check for an authentication cookie (for example, a "userAuth" cookie)
            const authCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith("B1SESSION="));
            return authCookie !== undefined;
        },
 
        // _handleResize: function () {
        //     const oRootControl = this.getRootControl(); // Access root control (App)
        //     const oSplitApp = oRootControl.byId("splitAppControl");
        //     if (oSplitApp) {  
        //         if (window.innerWidth <= 425) { 
        //             oSplitApp.setMode("HideMode");
		// 			oSplitApp.to(oSplitApp.getDetailPages()[0].getId());
        //         } else {
        //             oSplitApp.setMode("ShowHideMode");
        //         }
        //     } 
        // }, 

        // destroy: function () { 
        //     sap.ui.Device.resize.detachHandler(this._handleResize, this);
        //     UIComponent.prototype.destroy.apply(this, arguments);
        // }
	});
});
