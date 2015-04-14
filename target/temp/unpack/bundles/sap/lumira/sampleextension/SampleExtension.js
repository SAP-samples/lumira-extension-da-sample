define(["service!sap.bi.da.extension.sdk.clientRequestService", "SampleExtensionDialogController"], function (ClientRequestService, SampleExtensionDialogController) {
    "use strict";

    function SampleExtension() {

        var EXTENSION_ID = "sap.lumira.sampleextension";

        var fServiceCall = function(request, fSuccess, fFailure) {
        	// The ClientRequestService is a way for the extension to communicate to its Java backend
        	// request will be passed to getClientRequestJob()
        	// The value returned by clientRequestJob.execute() will be passed to the fSucess callback
        	// If an error occurs, the fFailure callback will be called
        	ClientRequestService.callClientRequestService(EXTENSION_ID, request, fSuccess, fFailure);
        };

        var createSampleExtensionDialog = function(acquisitionState, workflow) {
            var oDeferred = new jQuery.Deferred();
            var controller = new SampleExtensionDialogController(acquisitionState, oDeferred, fServiceCall, workflow);
            controller.showDialog();
            return oDeferred.promise();
        };

    	// This function will be called during a create dataset workflow
        // This function must immediately return a promise object
        // When the extension is finished performing UI tasks, resolve the promise with the acquisitionState and dataset name
        // Other workflows do not need the dataset name
        // The resolved acquisitionState will be passed to the extension Java backend getDataAcquisitionJobContext()
        this.doCreateWorkflow = function(acquisitionState) {
            return createSampleExtensionDialog(acquisitionState, "CREATE");
        };

    	// This function will be called during an edit dataset workflow
        this.doEditWorkflow = function(acquisitionState) {
            return createSampleExtensionDialog(acquisitionState, "EDIT");
        };

        // This function will be called during a refresh workflow
        // This function should refresh the dataset with existing parameters
        // Minimal UI should be shown, if any
        this.doRefreshWorkflow = function(acquisitionState) {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(acquisitionState);
            return oDeferred.promise();
        };
    }

    // Functions that do not need to access private variables can be declared as part of the prototype

    // This function must return an Object with properties Title and SubTitle, determined by the provided acquisitionState
    // This will be displayed as an entry in the Most Recently Used pane
    SampleExtension.prototype.getConnectionDescription = function(acquisitionState) {
        var info = JSON.parse(acquisitionState.info);
        return {
            Title: info.datasetName,
            SubTitle: info.csv
        };
    };

    // getIcon## must return a path to an image with size 48px*48px
    SampleExtension.prototype.getIcon48 = function() {
        return "/img/48.png";
    };
    SampleExtension.prototype.getIcon32 = function() {
        return "/img/32.png";
    };
    // The white version of the icon will be displayed when the extension is highlighted in the New Dataset dialog
    SampleExtension.prototype.getIcon32_white = function() {
        return "/img/32_w.png";
    };
    SampleExtension.prototype.getIcon24 = function() {
        return "/img/24.png";
    };
    SampleExtension.prototype.getIcon16 = function() {
        return "/img/16.png";
    };

    return SampleExtension;
});