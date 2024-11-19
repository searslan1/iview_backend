"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_controller_1 = require("../controller/register.controller"); // Doğru yolu buraya yazın
const router = (0, express_1.Router)();
const registerController = new register_controller_1.RegisterController();
// Register endpoint
router.post('/', registerController.register.bind(registerController));
exports.default = router;
