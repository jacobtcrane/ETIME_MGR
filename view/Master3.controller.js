//CHANGE - Master3 was Master2
sap.ui.core.mvc.Controller.extend("com.tsl.etime.mgr.view.Master3", {

	onInit : function() {
		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		//On phone devices, there is nothing to select from the list. There is no need to attach events.
		if (!sap.ui.Device.system.phone) {
    		this.getRouter().attachRoutePatternMatched(this.onRoutePatternMatched, this);
		}
	},

	onRoutePatternMatched : function(oEvent) {
		var sName = oEvent.getParameter("name");

//CHANGE - master3 was master2
		if (sName !== "master3") {
			return;
		}

//		Load the detail view in desktop

		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "com.tsl.etime.mgr.view.Master3",
			targetViewType : "XML",
			transition: "slide"
		});
	},

	onRouteMatched : function(oEvent) {
		var oParameters = oEvent.getParameters();

//CHANGE - master3 was master2
		if (oParameters.name === "master3") {
//ToCheck - Path OK?		    
			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

			var oEventBus = this.getEventBus();
			var that = this;
//CHANGE - master3List was master2List			
			this.byId("master3List").attachUpdateFinished(function(){
    			    that.selectFirstItem();
//CHANGE - Master3 was Master2    			    
                	oEventBus.publish("Master3", "LoadFinished",{
//CHANGE - master3List was master2List	                	    
                		oListItem: that.getView().byId("master3List").getItems()[0]
			    });
			});
		}
//CHANGE master03 was master02
		if (oParameters.name === "master03" && jQuery.device.is.phone) { 
    		this.getRouter().myNavToWithoutHash({ 
    			currentView : this.getView(),
    			targetViewName : "com.tsl.etime.mgr.view.Detail",
    			targetViewType : "XML",
    			transition : "slide"
    		});
		}
	},

	bindView : function (sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath); 

		//Check if the data is already on the client
		if(!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
				// 	this.showEmptyView();
					this.fireDetailNotFound();
				}
			}, this));
		}
	},

	selectFirstItem : function() {
//CHANGE - master3List was master2List		    
		var oList = this.getView().byId("master3List");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
		}
	},

	showEmptyView : function () {
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "com.tsl.etime.mgr.view.NotFound",
			targetViewType : "XML"
		});
	},

	fireDetailNotFound : function () {
//CHANGE - Master3 was Master2	    
		this.getEventBus().publish("Master3", "NotFound");
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onSearch : function() {
		// Add search filter
		var filters = [];
//CHANGE - master3SearchField was master2SearchField		
		var searchString = this.getView().byId("master3SearchField").getValue();
		if (searchString && searchString.length > 0) {
			filters = [ new sap.ui.model.Filter("", sap.ui.model.FilterOperator.Contains, searchString) ];
		}

		// Update list binding
//CHANGE - master3List was master2List			
		this.getView().byId("master3List").getBinding("items").filter(filters);
	},

	onSelect : function(oEvent){
		// Get the list item either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode)
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	showDetail : function(oItem) {
		// If we're on a phone device, include nav in history
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("detail", {
			from: "master3",
			entity: oItem.getBindingContext().getPath().substr(1)
		}, bReplace);
		

	},

	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}

});