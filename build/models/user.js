"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var userSchema = new mongoose_1.Schema({
    displayName: {
        type: String,
        required: true,
        lowercase: true
    },
    name: {
        familyName: {
            type: String,
            lowercase: true
        },
        givenName: {
            type: String,
            lowercase: true
        },
    },
    provider: {
        type: String
    },
    photos: [{ value: String }],
    emails: [{
            value: {
                type: String,
                required: true
            }
        }],
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true
        }]
}, {
    timestamps: true
});
var User = mongoose_1.default.model('User', userSchema);
exports.default = User;
