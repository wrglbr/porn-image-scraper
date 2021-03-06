"use strict";
exports.__esModule = true;
var yargs = require("yargs");
exports["default"] = yargs.options({
    dry: {
        alias: "d",
        type: "boolean",
        "default": false,
        description: "Run without download images"
    },
    folder: {
        type: "string",
        "default": "images",
        description: "Base folder to store images in"
    }
}).argv;
