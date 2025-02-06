sap.ui.define([
    "my/app/controller/Base.controller",
    "my/app/util/Helper"
], function (BaseController, Helper) {
    "use strict";

    return BaseController.extend("my.app.controller.Attachment", {
        onUploadChange: function (oEvent) {
            const oFile = oEvent.getParameter("files")[0];
            const oModel = this.oModel;

            if (oFile) {
                const oReader = new FileReader();
                oReader.onload = (e) => {
                    const sImagePath = e.target.result;
                    const sFileNameWithExtension = oFile.name;
                    const sFileName = sFileNameWithExtension.substring(0, sFileNameWithExtension.lastIndexOf("."));
                    const sFileExtension = oFile.name.split(".").pop();
                    const sAttachmentDate = new Date().toLocaleDateString();
                    const mimeType = oFile.type;

                    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
                    const isImage = imageExtensions.includes(sFileExtension);

                    const oNewItem = {
                        documentId: new Date().getTime(),
                        FileName: sFileName,
                        FileExtension: sFileExtension,
                        AttachmentDate: Helper.dateFormat({ format: 'MMM dd, yyyy', value: sAttachmentDate }),
                        SourcePath: isImage ? sImagePath : "",
                        mimeType: mimeType
                    };

                    const aItems = oModel.getProperty("/attachments") || [];
                    const files = oModel.getProperty("/files") || [];

                    files.push(oFile);
                    aItems.push(oNewItem);

                    oModel.setProperty("/attachments", aItems);
                    oModel.setProperty("/files", files);
                };
                oReader.readAsDataURL(oFile);
            }
        },

        onFileDeleted: function (oEvent) {
            const sDocumentId = oEvent.getParameter("documentId");
            const oModel = this.oModel;
            if (!oModel) return false;

            const aAttachments = oModel.getProperty("/attachments");
            const files = oModel.getProperty("/files");
            if (!Array.isArray(aAttachments)) {
                console.error("'attachments' is not an array or undefined:", aAttachments);
                return false;
            }

            const iIndexToRemove = aAttachments.findIndex(function (oItem) {
                return String(oItem.documentId) === String(sDocumentId);
            });

            if (iIndexToRemove === -1) {
                console.warn("No attachment found with documentId:", sDocumentId);
                return false;
            }

            aAttachments.splice(iIndexToRemove, 1);
            files.splice(iIndexToRemove, 1);
            oModel.setProperty("/attachments", aAttachments);
            oModel.setProperty("/files", files);
           
            return null;
        },

        onThumbnailPress: function (oEvent) {
            const oItem = oEvent.getSource();
            const sImagePath = oItem.getBindingContext("model").getProperty("SourcePath");

            if (sImagePath) {
                const newWindow = window.open();
                newWindow.document.write(`<img src="${sImagePath}" style="width:auto;height:auto;">`);
                newWindow.document.title = "Image Preview";
            } else {
                sap.m.MessageToast.show("Image not available");
            }
        }
    });
});
