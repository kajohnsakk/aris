"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSTANCE_PASS = exports.INSTANCE_EMAIL = exports.INSTANCE_NAME = void 0;
const IS_PRODUCTION = true;
let instance_name;
let instance_email;
let instance_pass;
if (IS_PRODUCTION) {
    instance_name = "arislab-uat";
    instance_email = "origin@convolab.ai";
    instance_pass = "1qazZAQ!";
}
else {
    instance_name = "arislab-dev";
    instance_email = "origin@convolab.ai";
    instance_pass = "1qazZAQ!";
}
exports.INSTANCE_NAME = instance_name;
exports.INSTANCE_EMAIL = instance_email;
exports.INSTANCE_PASS = instance_pass;
//# sourceMappingURL=AppConfig.js.map