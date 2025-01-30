sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "my/app/repository/ItemRepository",
    "my/app/util/Pagination",
    "my/app/util/Helper",
], function (
    Controller,
    ItemRepository,
    Pagination,
    Helper
) {
    "use strict";

    return Controller.extend("my.app.controller.Item", {

        onInit: function () {
            document.title = "Item Master Data";
            this.oModel = new sap.ui.model.json.JSONModel({});  
			this.getView().setModel(this.oModel, "model");

            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("item").attachPatternMatched(this.onItemListing, this);
        },

        formatDate: function(oDate){ 
            if (oDate) {
                return Helper.dateFormat({ format: 'dd MMM, yyyy', value: oDate })
            }
            return "";
        },

        onItemListing: async function () { 
            this.oModel.setData({
                pagination: {
                    currentPage: 1,
                    pageSize: 20,
                    totalItems: 0,
                    totalPages: 0,
                    hasPrevious: false,
                    hasNext: false
                },
                isLoading: true,  
                search: {}  
            }); 

            await this.loadData(1);
            this.oModel.setProperty("/isLoading", false);
        },

        loadData: async function (pageNumber) { 
            this.oModel.setProperty("/isLoading", true);
            const pageSize = this.oModel.getProperty("/pagination/pageSize");
            const search = this.oModel.getProperty("/search");
            const skip = (pageNumber - 1) * pageSize; 
            const filters = []; 

            const oParams = {
                $top: pageSize,
                $skip: skip,
                $count: true
            };

            if (search){
                // if (search.Search) filters.push(search.Search);
                // if (search.CustomerName) filters.push(search.CustomerName);
                // if (search.DocumentNo) filters.push(search.DocumentNo);
                // if (search.SaleEmployee) filters.push(search.SaleEmployee);
                // if (search.CustomerCode) filters.push(search.CustomerCode);
                // if (search.Status) filters.push(search.Status);
                // if (search.DocDate) filters.push(search.DocDate);
            }

            if (filters.length > 0) oParams.$filter = filters.join(' and ');
            
            try { 
                const data = await ItemRepository.get(oParams);  
                const totalItems = data["odata.count"]; 
                const totalPages = Pagination.getTotalPages(totalItems, pageSize); 
                this.oModel.setProperty("/data", data.value);
                this.oModel.setProperty("/pagination/totalItems", totalItems);
                this.oModel.setProperty("/pagination/totalPages", totalPages);
                const paginationInfo = Pagination.getPaginationInfo(totalItems, pageSize, pageNumber);
                this.oModel.setProperty("/pagination", paginationInfo); 

            } catch (error){
                console.error("Error loading data:", error);
            } 
            this.oModel.setProperty("/isLoading", false);
        },

        onNextPage: function (){
            let currentPage = this.oModel.getProperty("/pagination/currentPage");
            const totalPages = this.oModel.getProperty("/pagination/totalPages");

            if (currentPage < totalPages){
                currentPage++;
                this.loadData(currentPage);
            }
        },

        onPreviousPage: function (){
            let currentPage = this.oModel.getProperty("/pagination/currentPage");

            if (currentPage > 1){
                currentPage--;
                this.loadData(currentPage);
            }
        },

        onFirstPage: function (){
            this.loadData(1);
        },

        onLastPage: function (){
            const totalPages = this.oModel.getProperty("/pagination/totalPages");
            this.loadData(totalPages);
        },
    });
});
