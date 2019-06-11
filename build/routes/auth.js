"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var router = express_1.default.Router();
// Google auth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    var _id = req.user._id;
    res.redirect("http://localhost:3000/users/" + _id);
});
// Facebook auth routes
router.get('/facebook', passport_1.default.authenticate('facebook'));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/' }), function (req, res) {
    var _id = req.user._id;
    res.redirect("http://localhost:3000/users/" + _id);
});
// Signout
router.get('/signout', function (req, res) {
    req.logout();
    res.redirect('http://localhost:3000');
});
exports.default = router;
