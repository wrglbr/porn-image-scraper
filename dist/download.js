"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var axios_1 = require("axios");
var cli_progress_1 = require("cli-progress");
var args_1 = require("./args");
var baseFolder = path_1.resolve(args_1["default"].folder);
if (!fs_1.existsSync(baseFolder)) {
    fs_1.mkdirSync(baseFolder);
}
function downloadImages(gallery, urls) {
    return __awaiter(this, void 0, void 0, function () {
        var galleryFolder, _i, urls_1, url, path, linkDone, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    galleryFolder = path_1.join(baseFolder, gallery);
                    if (!fs_1.existsSync(galleryFolder)) {
                        try {
                            fs_1.mkdirSync(galleryFolder);
                        }
                        catch (err) {
                            console.error("Could not create gallery folder");
                            process.exit(1);
                        }
                    }
                    _i = 0, urls_1 = urls;
                    _a.label = 1;
                case 1:
                    if (!(_i < urls_1.length)) return [3 /*break*/, 8];
                    url = urls_1[_i];
                    path = path_1.join(galleryFolder, path_1.basename(url));
                    linkDone = false;
                    _a.label = 2;
                case 2:
                    if (!!linkDone) return [3 /*break*/, 7];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, downloadFile(url, path)];
                case 4:
                    _a.sent();
                    linkDone = true;
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error downloading url:", url);
                    try {
                        fs_1.unlinkSync(path);
                    }
                    catch (err) { }
                    console.error("Retrying url:", url);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 2];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.downloadImages = downloadImages;
function downloadFile(url, file) {
    return __awaiter(this, void 0, void 0, function () {
        var downloadBar, response, writer, totalSize, loaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (fs_1.existsSync(file)) {
                        console.warn("\t" + url + " already exists, skipping...");
                        return [2 /*return*/];
                    }
                    console.error("\tDownloading " + url + " to " + file + "...");
                    downloadBar = new cli_progress_1.SingleBar({}, cli_progress_1.Presets.legacy);
                    downloadBar.start(100, 0);
                    return [4 /*yield*/, axios_1["default"]({
                            url: url,
                            method: "GET",
                            responseType: "stream"
                        })];
                case 1:
                    response = _a.sent();
                    writer = fs_1.createWriteStream(file);
                    totalSize = response.headers["content-length"];
                    loaded = 0;
                    response.data.on("data", function (data) {
                        loaded += Buffer.byteLength(data);
                        var percent = ((loaded / totalSize) * 100).toFixed(0);
                        downloadBar.update(+percent);
                    });
                    response.data.pipe(writer);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            writer.on("finish", resolve);
                            writer.on("error", reject);
                        })];
                case 2:
                    _a.sent();
                    downloadBar.stop();
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadFile = downloadFile;
