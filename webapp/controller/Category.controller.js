sap.ui.define([
    "my/app/controller/Base.controller",
    "my/app/repository/CategoryRepository",
    "my/app/util/Pagination",
    "my/app/controller/Attachment.controller"
], function (
    BaseController,
    CategoryRepository,
    Pagination,
    AttachmentController
) {
    "use strict";

    const CategoryController = BaseController.extend("my.app.controller.Category", {
        
        onInit: function () {
            BaseController.prototype.onInit.call(this);
            document.title = "Category";

            this.oRouter.getRoute("category").attachPatternMatched(this.onListing, this);
            this.oRouter.getRoute("category_create").attachPatternMatched(this.onCreateForm, this);
        },

        onListing: async function () {
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

            if (search) {
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
                const data = await CategoryRepository.get(oParams);
                
                const totalItems = data["odata.count"]; 
                this.oModel.setProperty("/data", data.value);
                this.oModel.setProperty("/pagination/totalItems", totalItems);
                this.oModel.setProperty("/pagination/totalPages", Pagination.getTotalPages(totalItems, pageSize)); 
                this.oModel.setProperty("/pagination", Pagination.getPaginationInfo(totalItems, pageSize, pageNumber));

            } catch (error) {
                console.error("Error loading data:", error);
            }
            this.oModel.setProperty("/isLoading", false);
        },

        onPressCreate: function () {
            this.oRouter.navTo("category_create");
        },

        onCreateForm: function () {
            this.oModel.setData({
                titleForm: "Create Category",
                buttonSubmit: "Save",
                status: 'true',
                statusList: [
                    {
                        'name': "Active",
                        'value': true,
                    },
                    {
                        'name': "Inactive",
                        'value': false,
                    }
                ]
            });
        },

        handlerSave: function () {
            const data = this.oModel.getData(); 
            const formData = new FormData();
        
            formData.append("code", data.code);
            formData.append("foreign_name", data.foreign_name);
            formData.append("name", data.name);
            formData.append("status", data.status);
        
            // Append attachments
            // if (Array.isArray(data.attachments)) {
            //     data.attachments.forEach((attachment, index) => {
            //         formData.append(`attachments[${index}][documentId]`, attachment.documentId);
            //         formData.append(`attachments[${index}][FileName]`, attachment.FileName);
            //         formData.append(`attachments[${index}][FileExtension]`, attachment.FileExtension);
            //         formData.append(`attachments[${index}][AttachmentDate]`, attachment.AttachmentDate);
            //         formData.append(`attachments[${index}][SourcePath]`, attachment.SourcePath);
            //         formData.append(`attachments[${index}][mimeType]`, attachment.mimeType);
            //     });
            // }

            if (Array.isArray(data.files)) {
                data.files.forEach((file, index) => {
                    formData.append(`files[${index}]`, file, file.name);
                });
            }
        }
        
    });

    if (AttachmentController) {
        Object.assign(CategoryController.prototype, AttachmentController.prototype);
    }

    return CategoryController;
});
