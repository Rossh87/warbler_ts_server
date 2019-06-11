"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// Get Mongoose models
var user_1 = __importDefault(require("../models/user"));
var message_1 = __importDefault(require("../models/message"));
// Get all msgs from db and return them
exports.getMessages = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, message_1.default.find()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
// Get all messages with their 'author' property populated with a user object,
// and pruned for convenience/efficiency
exports.getPopulatedMessages = function () { return __awaiter(_this, void 0, void 0, function () {
    var messages, populatedMsgs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.getMessages()];
            case 1:
                messages = _a.sent();
                return [4 /*yield*/, Promise.all(messages.map(function (msg) {
                        return msg.populate('author', 'createdAt updatedAt displayName photos').execPopulate();
                    }))];
            case 2:
                populatedMsgs = _a.sent();
                return [2 /*return*/, populatedMsgs];
        }
    });
}); };
// Creates a new msg and returns it.  Note that pre-save hook in Message model
// updates the User document that corresponds to the message's author.  If an invalid
// id is passed to createMessage, the pre-save hook will throw, preventing the creation of
// a new message document.
exports.createMessage = function (text, author) { return __awaiter(_this, void 0, void 0, function () {
    var newMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!text || !author) {
                    throw new Error('Text and Author information required to create new message');
                }
                return [4 /*yield*/, message_1.default.create({ text: text, author: author })];
            case 1:
                newMessage = _a.sent();
                return [2 /*return*/, newMessage];
        }
    });
}); };
// Not currently used, may be useful later.  Lookup and return any user document
// By _id.
exports.getUser = function (_id) { return __awaiter(_this, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, user_1.default.findById(_id)];
            case 1:
                user = _a.sent();
                return [2 /*return*/, user];
        }
    });
}); };
