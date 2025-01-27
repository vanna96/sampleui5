sap.ui.define([], function () {
    "use strict";

    return {
        callApi: function (sMethod, sEndpoint, oData) {
            const isFormData = oData instanceof FormData;
            const sUrl = this.getUrl(sEndpoint);

            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    url: sUrl,
                    type: sMethod,
                    contentType: isFormData ? false : "application/json", 
                    processData: !isFormData,
                    data: isFormData ? oData : oData ? JSON.stringify(oData) : null, 
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        resolve(data);  // Resolve the promise with the data
                    },
                    error: function (error) {
                        reject(error);  // Reject the promise with the error
                    }
                });
            });
        },

        getUrl: function (sEndpoint) {
            return "https://192.168.1.199:50000/b1s/v1/" + sEndpoint;
        }
    };
});
