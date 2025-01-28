sap.ui.define([
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "my/app/util/Cookie",
], (
    Device,
    Controller,
    Fragment,
    Cookie
) => {
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
            const phone = Device.system.phone;
            const desktop = Device.system.desktop;

            if (desktop) oSplitApp.showMaster();
            if (phone) {
                oSplitApp.hideMaster();
                oSplitApp.to(oSplitApp.getDetailPages()[0].getId());
            }
        },

        onSideNavButtonPress: function () {
            const oSplitApp = this.byId("splitAppControl");
            const phone = Device.system.phone;
            const desktop = Device.system.desktop;


            if (desktop) {
                if (oSplitApp.isMasterShown()) {
                    oSplitApp.hideMaster();
                    oSplitApp.setMode("HideMode");
                } else {
                    oSplitApp.showMaster();
                    oSplitApp.setMode("ShowHideMode");
                }
            }

            if (phone) {
                if (oSplitApp.isMasterShown()) {
                    oSplitApp.hideMaster();
                    oSplitApp.to(oSplitApp.getDetailPages()[0].getId());
                } else {
                    oSplitApp.showMaster();
                    oSplitApp.to(oSplitApp.getMasterPages()[0].getId());
                }
            }
        },

        onItemSelect: function (oEvent) {
            const sKey = oEvent.getParameter("item").getKey();
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo(sKey);
        },

        onMyAccount: function () {
            const oView = this.getView(),
                oButton = oView.byId("button");

            if (!this._oMenuFragment) {
                this._oMenuFragment = Fragment.load({
                    id: oView.getId(),
                    name: "my.app.view.layouts.Menu",
                    controller: this
                }).then(function (oMenu) {
                    oMenu.openBy(oButton);
                    this._oMenuFragment = oMenu;
                    return this._oMenuFragment;
                }.bind(this));
            } else {
                this._oMenuFragment.openBy(oButton);
            }
        },

        onLogoutPress: function () {
            Cookie.deleteCookie("B1SESSION");
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("login");
        }
    });

});
