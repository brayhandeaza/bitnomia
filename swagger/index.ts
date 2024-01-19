import swaggerJSDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import blockchain from './blockchain'
import wallets from './wallets'
import transactions from './transactions'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Brayhan's Blockchain API",
            version: '1.0.0',
        },
        "Order": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int64"
                }
            },
            "xml": {
                "name": "Order"
            }
        }
    },
    host: "http://localhost:3000/json-rpc",
    basePath: "/",
    apis: [__filename],
    paths: {},
};

const swaggerSpec = swaggerJSDoc(options);
swaggerSpec['paths'] = {
    ...blockchain,
    ...wallets,
    ...transactions
};


export {
    serve,
    setup,
    swaggerSpec
};
