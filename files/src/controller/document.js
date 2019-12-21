let code = '';

const makeSwaggerDocument = function (name) {

    code = `
    import { Get, getMetadataArgsStorage, JsonController } from "routing-controllers";
import { getFromContainer, MetadataStorage } from "class-validator";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { appEnv } from "../helpers/EnvHelper";
import { NotFoundException } from "../exception/ResponseException";

@JsonController()
export class DocumentController {
    constructor() {}

    @Get("/swagger.json")
    Get(): any {
        if (!appEnv("DEBUG", false)) {
            throw new NotFoundException();
        }
        const storage = getMetadataArgsStorage();
        const metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
        const schemas = validationMetadatasToSchemas(metadatas, {
            refPointerPrefix: "#/components/schemas/"
        });
        return routingControllersToSpec(
            storage,
            {},
            {
                components: {
                    schemas: schemas,
                    securitySchemes: {
                        apiKeyAuth: {
                            type: "apiKey",
                            description: "Api authentication token",
                            name: "Authorization",
                            in: "header"
                        }
                    }
                },
                info: { title: "App", version: "0.0.0.1" }
            }
        );
    }
}

    

    
` ;

    return code;

};

module.exports = makeSwaggerDocument;

