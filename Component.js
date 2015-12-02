jQuery.sap.declare("com.transfieldservices.Component");
jQuery.sap.require("com.transfieldservices.MyRouter");

sap.ui.core.UIComponent.extend("com.transfieldservices.Component", {
	metadata : {
		name : "TDG Demo App",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "com.transfieldservices.view.App",

		config : {
			resourceBundle : "i18n/messageBundle.properties",
			serviceConfig : {
				name: "ZHTR_ETIME_MANAGER_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZHTR_ETIME_MANAGER_SRV/"
			}
		},

		routing : {
			config : {
				routerClass : com.transfieldservices.MyRouter,
				viewType : "XML",
				viewPath : "com.transfieldservices.view",
				clearTarget : false,
				transition: "slide"
			},
//CHANGE - New Router Code			
// 			routes : [
// 				{
// 					pattern : "",
// 					name : "main",
// 					view : "Master",
// 					viewLevel : 1,
// 					targetAggregation : "masterPages",
// 					targetControl : "idAppControl",
// 					subroutes : [
// 						{
// 							pattern : "master2/{entity}",
// 							name : "master2",
// 							view : "Master2",
//         					viewLevel : 2,
//             				targetAggregation : "masterPages"
// 						}
// 		    		]
// 				},
// 				{
// 					pattern : "master02/{entity}",
// 					name : "master02",
// 					view : "Master2",
// 					viewLevel : 2,
// 					targetAggregation : "masterPages",
// 					subroutes : [
// 						{
// 							pattern : "master02/{entity}",
// 							name : "detail",
// 							view : "Detail",
//         					viewLevel : 3,
//             				targetAggregation : "detailPages"
// 						}
// 		    		]
// 				}
// 		    ]
// 			routes : [
// 				{
// 					pattern : "",
// 					name : "main",
// 					view : "Master",
// 					viewLevel : 1,
// 					targetAggregation : "masterPages",
// 					targetControl : "idAppControl",
// 					subroutes : [
// 						{
// 							pattern : "master2/{entity}",
// 							name : "master2",
// 							view : "Master2",
//         					viewLevel : 2,
//             				targetAggregation : "masterPages"
// 						}
// 		    		]
// 				},
// 				{
// 					pattern : "master02/{entity}",
// 					name : "master02",
// 					view : "Master2",
// 					viewLevel : 2,
// 					targetAggregation : "masterPages",
// 					subroutes : [
// 						{
// 							pattern : "master02/{entity}",
// 							name : "master3",
// 							view : "Master3",
//         					viewLevel : 3,
//             				targetAggregation : "masterPages"
// 						}
// 		    		]
// 				},
// 				{
// 					pattern : "master03/{entity}",
// 					name : "master03",
// 					view : "Master3",
// 					viewLevel : 3,
// 					targetAggregation : "masterPages",
// 					subroutes : [
// 						{
// 							pattern : "master03/{entity}",
// 							name : "detail",
// 							view : "Detail",
//         					viewLevel : 4,
//             				targetAggregation : "detailPages"
// 						}
// 		    		]
// 				}				
// 		    ]
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					viewLevel : 1,
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
//Not sure why this is here except possibly to handle initial navigation from a bookmark?					
					subroutes : [
						{
							pattern : "master2/{entity}",
							name : "master2",
							view : "Master2",
        					viewLevel : 2,
            				targetAggregation : "masterPages"
						}
		    		]
				},
				{
					pattern : "master02/{entity}",
					name : "master02",
					view : "Master2",
					viewLevel : 2,
					targetAggregation : "masterPages",
				 	subroutes : [
				 		{
				 			pattern : "master3/{entity}",
				 			name : "master3",
				 			view : "Master3",
         					viewLevel : 3,
             				targetAggregation : "masterPages"
				 		}
		    		]
				},
				{
					pattern : "master03/{entity}",
					name : "master03",
					view : "Master3",
					viewLevel : 3,
					targetAggregation : "masterPages2",
					subroutes : [
						{
							pattern : "master03/{entity}",
							name : "detail",
							view : "Detail",
        					viewLevel : 4,
            				targetAggregation : "detailPages"
						}
		    		]
				}	
				// 	{
				// 	pattern : "master02/{entity}/master03",
				// 	name : "master03",
				// 	view : "Master3",
				// 	viewLevel : 3,
				// 	targetAggregation : "masterPages2",
				// 	subroutes : [
				// 		{
				// 			pattern : "master03/{entity}",
				// 			name : "detail",
				// 			view : "Detail",
    //     					viewLevel : 4,
    //         				targetAggregation : "detailPages"
				// 		}
		  //  		]
				// }				
		    ]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();
		
		// Always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("com.transfieldservices");

		// Set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		//This code is only needed for testing the application when there is no local proxy available
		var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
		// Start the mock server for the domain model
		if (bIsMocked) {
			this._startMockServer(sServiceUrl);
		}

		// Create and set domain model to the component
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, {json: true,loadMetadataAsync: true});
		this.setModel(oModel);

		// Set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

		this.getRouter().initialize();

	},

	_startMockServer : function (sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter : iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();


		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 2000
		});
	}
});