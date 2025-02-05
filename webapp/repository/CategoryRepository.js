sap.ui.define([
    "my/app/util/HttpService",
], function (HttpService){
    "use strict";

    return {
        endPoint: "Category",
        get: async function (queryParams) {
            function toQueryString(params){
                return Object.keys(params)
                    .map(function (key){
                        return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
                    })
                    .join("&");
            }

            return {
                "odata.count":3,
                value:[
                    {
                        'id': "1",
                        'name': "រូបវែង",
                        'foreign_name': "រូបវែង",
                        'parent': "",
                    },
                    {
                        'id': "2",
                        'name': "រូបខ្លី",
                        'foreign_name': "រូបខ្លី",
                        'parent': "",
                    },
                    {
                        'id': "3",
                        'name': "អាវប៉ាក់ស",
                        'foreign_name': "អាវប៉ាក់ស",
                        'parent': "",
                    },
                    {
                        'id': "4",
                        'name': "អាវបុរស",
                        'foreign_name': "អាវបុរស",
                        'parent': "",
                    },
                    {
                        'id': "5",
                        'name': "ប្រូម៉ូសិនពិសេស",
                        'foreign_name': "ប្រូម៉ូសិនពិសេស",
                        'parent': "",
                    },
                    {
                        'id': "6",
                        'name': "ប្រូម៉ូសិនចុះ៥០%",
                        'foreign_name': "ប្រូម៉ូសិនចុះ៥០%",
                        'parent': "ប្រូម៉ូសិនពិសេស",
                    },
                    {
                        'id': "7",
                        'name': "ធ្វើការ ឬកម្មវិធីផ្សេងៗ",
                        'foreign_name': "ធ្វើការ ឬកម្មវិធីផ្សេងៗ",
                        'parent': "",
                    },
                    {
                        'id': "8",
                        'name': "ម៉ូតទើបចេញថ្មី",
                        'foreign_name': "ម៉ូតទើបចេញថ្មី",
                        'parent': "",
                    }
                ]
            }
            
            const queryString = queryParams ? "?" + toQueryString(queryParams) : "";
            return await HttpService.callApi("GET", `${this.endPoint}${queryString}`); 
        } 
    };
});
