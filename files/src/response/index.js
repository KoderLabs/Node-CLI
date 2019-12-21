let code = '';

const makeResponseIndex = function (name) {

    code = `
    import { BadRequestResponse, MessageResponse, MessageWithIdResponse } from "./common";
    export { BadRequestResponse, MessageResponse, MessageWithIdResponse };
    
` ;

    return code;

};

module.exports = makeResponseIndex;

