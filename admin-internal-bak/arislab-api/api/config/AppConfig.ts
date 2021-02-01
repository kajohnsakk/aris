const IS_PRODUCTION: boolean = true;

let instance_name: string;
let instance_email: string;
let instance_pass: string;

if( IS_PRODUCTION ) {
    instance_name = "arislab-uat";
    instance_email = "origin@convolab.ai";
    instance_pass = "1qazZAQ!";
} else {
    instance_name = "arislab-dev";
    instance_email = "origin@convolab.ai";
    instance_pass = "1qazZAQ!";
}

export const INSTANCE_NAME: string = instance_name;
export const INSTANCE_EMAIL: string = instance_email;
export const INSTANCE_PASS: string = instance_pass;