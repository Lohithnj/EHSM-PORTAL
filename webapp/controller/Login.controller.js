sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("ehsm1.controller.Login", {
        onInit: function () {

        },

        onLoginPress: function () {
            var oView = this.getView();
            var sEmployeeId = oView.byId("employeeIdInput").getValue();
            var sPassword = oView.byId("passwordInput").getValue();

            if (!sEmployeeId || !sPassword) {
                MessageToast.show("Please enter both Employee ID and Password");
                return;
            }

            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/LoginSet(EmployeeId='" + sEmployeeId + "',Password='" + sPassword + "')";

            oView.setBusy(true);
            oModel.read(sPath, {
                success: function (oData) {
                    oView.setBusy(false);
                    if (oData.Status === "Success") {
                        MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("loginSuccess"));
                        var oRouter = this.getOwnerComponent().getRouter();
                        oRouter.navTo("RouteDashboard", {
                            EmployeeId: sEmployeeId
                        });
                    } else {
                        MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText("loginError"));
                    }
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    MessageBox.error("Error connecting to server. Please try again.");
                }
            });
        }
    });
});
