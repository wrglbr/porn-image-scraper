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
var axios_1 = require("axios");
var fs_1 = require("fs");
var jsdom_1 = require("jsdom");
var path_1 = require("path");
var baseFolder = "images";
if (!fs_1.existsSync(baseFolder))
    fs_1.mkdirSync(baseFolder);
function downloadImage(url, path) {
    return __awaiter(this, void 0, void 0, function () {
        var writer, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    writer = fs_1.createWriteStream(path);
                    return [4 /*yield*/, axios_1["default"]({
                            url: url,
                            method: "GET",
                            responseType: "stream"
                        })];
                case 1:
                    response = _a.sent();
                    response.data.pipe(writer);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            writer.on("finish", resolve);
                            writer.on("error", reject);
                        })];
            }
        });
    });
}
function qs(dom, query) {
    return dom.window.document.querySelector(query);
}
function qsAll(dom, query) {
    return dom.window.document.querySelectorAll(query);
}
function getImageLinks(dom) {
    return Array.from(qsAll(dom, ".thumbnails-gallery > a")).map(function (el) {
        return el.getAttribute("href");
    });
}
function createDomFromURL(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    html = response.data;
                    return [2 /*return*/, new jsdom_1.JSDOM(html)];
            }
        });
    });
}
function scrapeImagePage(url) {
    return __awaiter(this, void 0, void 0, function () {
        var dom, fullSizeImageSrc, urlSegments, galleryName, galleryFolder, imageUrl, imageFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\tGetting " + url + "...");
                    return [4 /*yield*/, createDomFromURL(url)];
                case 1:
                    dom = _a.sent();
                    fullSizeImageSrc = qs(dom, ".fullsize-image").getAttribute("src");
                    urlSegments = url.split("/");
                    galleryName = urlSegments[urlSegments.length - 2];
                    galleryFolder = path_1.join(baseFolder, galleryName);
                    if (!fs_1.existsSync(galleryFolder)) {
                        try {
                            fs_1.mkdirSync(galleryFolder);
                        }
                        catch (err) {
                            console.error("Could not create gallery folder");
                            process.exit(1);
                        }
                    }
                    imageUrl = urlSegments.slice(0, -1).join("/") + "/" + fullSizeImageSrc;
                    imageFile = path_1.join(galleryFolder, fullSizeImageSrc.replace(".html", ".jpg"));
                    if (!!fs_1.existsSync(imageFile)) return [3 /*break*/, 3];
                    return [4 /*yield*/, downloadImage(imageUrl, imageFile)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log("\tImage " + imageFile + " already exists");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function scrapeLink(url) {
    return __awaiter(this, void 0, void 0, function () {
        var dom, imageLinks, _i, imageLinks_1, imageLink, imagePage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Getting " + url + "...");
                    return [4 /*yield*/, createDomFromURL(url)];
                case 1:
                    dom = _a.sent();
                    imageLinks = getImageLinks(dom);
                    _i = 0, imageLinks_1 = imageLinks;
                    _a.label = 2;
                case 2:
                    if (!(_i < imageLinks_1.length)) return [3 /*break*/, 5];
                    imageLink = imageLinks_1[_i];
                    imagePage = url.replace("index.html", imageLink);
                    return [4 /*yield*/, scrapeImagePage(imagePage)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var urls, _i, urls_1, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urls = process.argv.slice(2);
                if (!urls.length) {
                    console.error("ts-node . url0 url1 ...");
                    process.exit(1);
                }
                _i = 0, urls_1 = urls;
                _a.label = 1;
            case 1:
                if (!(_i < urls_1.length)) return [3 /*break*/, 4];
                url = urls_1[_i];
                return [4 /*yield*/, scrapeLink(url)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); })();
