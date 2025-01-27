sap.ui.define([
	"sap/ui/Device",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/base/strings/formatMessage"
], (Device, Controller) => {
	"use strict";

	return Controller.extend("my.app.controller.Main", {
		onInit: function () { 
			const oModel = new sap.ui.model.json.JSONModel(); 
			oModel.loadData(sap.ui.require.toUrl("my/app/model/menu.json"));
			this.getView().setModel(oModel, "menu"); 
			// this.onSideNavButtonPress()
			const oRouter = this.getOwnerComponent().getRouter(); // Correct way to get the router
			oRouter.initialize(); // Initialize the router

			// Attach route matched event
			oRouter.attachRouteMatched(this._onRouteMatched, this);
        },

		_onRouteMatched: function () {
			this._handleResize();
		},

		_handleResize: function () {
            const oSplitApp = this.byId("splitAppControl");
            if (oSplitApp) {  
                if (window.innerWidth <= 425) { 
                    oSplitApp.setMode("HideMode");
					oSplitApp.to(oSplitApp.getDetailPages()[0].getId());
                } else {
                    oSplitApp.setMode("ShowHideMode");
                }
            } 
        }, 

		onSideNavButtonPress: function () {
			const oSplitApp = this.byId("splitAppControl");
			if (Device.system.phone) {
				const currentMode = oSplitApp.getMode();
				if (currentMode === "ShowHideMode") {
					oSplitApp.setMode("HideMode");  
					oSplitApp.to(oSplitApp.getDetailPages()[0].getId());
				} else {
					oSplitApp.setMode("ShowHideMode");  
					oSplitApp.to(oSplitApp.getMasterPages()[0].getId());
				} 
			} else { 
				const currentMode = oSplitApp.getMode();
				if (currentMode === "ShowHideMode" || currentMode === "StretchCompressMode") {
					oSplitApp.setMode("HideMode");
				} else {
					oSplitApp.setMode("ShowHideMode");
				}
			}
		},
		
		onItemSelect: function (oEvent) {
			const sKey = oEvent.getParameter("item").getKey();
			const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo(sKey);
		}
	});

});
