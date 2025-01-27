sap.ui.define(["require"], (require) => {
	"use strict";
	return {
		resolvePath(sPath) { 
			return require.toUrl("../") + sPath;
		}
	};
});
