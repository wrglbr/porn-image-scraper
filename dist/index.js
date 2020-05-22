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
var pornstar_1 = require("./scrapers/pornstar");
var babesource_1 = require("./scrapers/babesource");
var download_1 = require("./download");
var tubsexer_1 = require("./scrapers/tubsexer");
var coedcherry_1 = require("./scrapers/coedcherry");
var pornpics_1 = require("./scrapers/pornpics");
var sweet_pornstars_1 = require("./scrapers/sweet-pornstars");
var europornstar_1 = require("./scrapers/europornstar");
var dry = false;
function scrapeLink(url) {
    return __awaiter(this, void 0, void 0, function () {
        var scrapers, tuple, scraper, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Getting " + url + "...");
                    scrapers = [
                        ["porn-star.com", new pornstar_1.PornStarScraper()],
                        ["babesource.com", new babesource_1.BabesourceScraper()],
                        ["tubsexer.com", new tubsexer_1.TubsexerScraper()],
                        ["coedcherry.com", new coedcherry_1.CoedcherryScraper()],
                        ["pornpics.com", new pornpics_1.PornpicsScraper()],
                        ["sweet-pornstars.com", new sweet_pornstars_1.SweetPornstarsScraper()],
                        ["europornstar.com", new europornstar_1.EuropornstarScraper()],
                    ];
                    tuple = scrapers.find(function (t) { return url.includes(t[0]); });
                    if (!tuple) return [3 /*break*/, 5];
                    scraper = tuple[1];
                    return [4 /*yield*/, scraper.scrape(url)];
                case 1:
                    result = _a.sent();
                    if (!dry) return [3 /*break*/, 2];
                    console.log(result);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, download_1.downloadImages(result.gallery, result.links.filter(Boolean))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    console.error("Unsupported site: " + url);
                    process.exit(1);
                    _a.label = 6;
                case 6: return [2 /*return*/];
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
                    console.error("(ts-)node . url0 url1 ...");
                    process.exit(1);
                }
                _i = 0, urls_1 = urls;
                _a.label = 1;
            case 1:
                if (!(_i < urls_1.length)) return [3 /*break*/, 4];
                url = urls_1[_i];
                if (url == "--dry") {
                    dry = true;
                    return [3 /*break*/, 3];
                }
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
