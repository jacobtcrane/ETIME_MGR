sap.ui.core.mvc.Controller.extend("com.broadspectrum.etime.mgr.view.Detail2", {

	onInit: function() {
// 		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

// 		if (sap.ui.Device.system.phone) {
// 			//Do not wait for the master2 when in mobile phone resolution
// 			this.oInitialLoadFinishedDeferred.resolve();
// 		} else {
// 			var oEventBus = this.getEventBus();
// 			oEventBus.subscribe("Detail", "LoadFinished", this.onMasterLoaded, this);
// 		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);
// 		this.oRouter.attachRouteMatched(function(e) {
// 			if (e.getParameter("name") === "detail") {
// 				var d = e.getParameter("arguments").contextPath + "/HeaderDetails";
// 				d = d.replace("WorkflowTaskCollection", "/WorkflowTaskCollection");
// 				var c = this;
// 				if (c.sContext !== d || c.sContext === "") {
// 					this.sContext = d;
// 					this.refreshScreen(d);
// 				}
// 			}
// 		}, this);
	},

	onMasterLoaded: function(sChannel, sEvent, oData) {
		if (oData.oListItem) {
			this.bindView(oData.oListItem.getBindingContext().getPath());
			this.oInitialLoadFinishedDeferred.resolve();
		}
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {

			// When navigating in the Detail page, update the binding context 
			if (oParameters.name === "detail2") {
				var sEntityPath = "/DetailViewSet(Epernr=\'" + oParameters.arguments.Epernr+"\',Dateworked="+oParameters.arguments.Dateworked +",Seqnr=\'"+oParameters.arguments.Seqnr+"\')";
				this.bindView(sEntityPath);
			} else {
				return;
			}
		}, this));
	},

	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found
			var oData = oView.getModel().getData(sEntityPath);
			if (!oData) {
				this.showEmptyView();
				this.fireDetailNotFound();
			} else {
				this.fireDetailChanged(sEntityPath);
			}

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},

	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "com.broadspectrum.etime.mgr.view.NotFound",
			targetViewType: "XML"
		});
	},

	fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("DetailViewSet", "Changed", {
			sEntityPath: sEntityPath
		});
	},

	fireDetailNotFound: function() {
		this.getEventBus().publish("DetailViewSet", "NotFound");
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1)
		}, true);
	},

	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onExit: function(oEvent) {
		this.getEventBus().unsubscribe("Detail", "LoadFinished", this.onMasterLoaded, this);
	}
});