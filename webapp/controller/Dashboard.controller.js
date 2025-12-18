sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Controller.extend("ehsm1.controller.Dashboard", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDashboard").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sEmployeeId = oEvent.getParameter("arguments").EmployeeId;
            this._sEmployeeId = sEmployeeId;
            this._loadProfile(sEmployeeId);
            this._filterTables(sEmployeeId);
        },

        _loadProfile: function (sEmployeeId) {
            var oView = this.getView();
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ProfileSet('" + sEmployeeId + "')";

            oView.setBusy(true);
            oModel.read(sPath, {
                success: function (oData) {
                    oView.setBusy(false);
                    var oProfileModel = new JSONModel(oData);
                    oView.setModel(oProfileModel, "profile");
                }.bind(this),
                error: function (oError) {
                    oView.setBusy(false);
                    MessageBox.error("Failed to load profile data.");
                }
            });
        },

        _filterTables: function (sEmployeeId) {
            var oFilter = new Filter("EmployeeId", FilterOperator.EQ, sEmployeeId);

            var oIncidentTable = this.byId("incidentTable");
            var oIncidentBinding = oIncidentTable.getBinding("items");
            oIncidentBinding.filter([oFilter]);

            var oRiskTable = this.byId("riskTable");
            var oRiskBinding = oRiskTable.getBinding("items");
            oRiskBinding.filter([oFilter]);
        },

        formatStatusState: function (sStatus) {
            if (!sStatus) return "None";
            switch (sStatus) {
                case "Open": return "Error"; // Red
                case "In Progress": return "Warning"; // Orange
                case "Closed": return "Success"; // Green
                default: return "None";
            }
        },

        formatSeverityState: function (sSeverity) {
            if (!sSeverity) return "None";
            switch (sSeverity) {
                case "High": return "Error"; // Red
                case "Medium": return "Warning"; // Orange
                case "Low": return "Success"; // Green
                default: return "None";
            }
        },

        onLogout: function () {
            this.getOwnerComponent().getRouter().navTo("RouteLogin");
        }
    });
});
