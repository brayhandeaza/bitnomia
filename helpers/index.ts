export const pathsGenerator = (method: string, tags: string, description: string, params: any = {}, parameters: any = []) => {
    return {
        post: {
            tags: [tags],
            summary: method,
            description,
            consumes: [
                "application/json"
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "jsonrpc": {
                                    "type": "string",
                                    "default": "2.0"
                                },
                                "method": {
                                    "type": "string",
                                    "default": method
                                },
                                "params": {
                                    "type": "object",
                                    "default": params
                                }
                            },
                            "required": ["jsonrpc", "method"]
                        }
                    }
                }
            },
            parameters,
            responses: {
                "200": {
                    "description": "Successful operation",
                }
            }
        }
    }
}


export const DYNAMIC_DECIMAL = (number: number) => {
    if (Math.abs(number) >= 1) {
        return Math.round(number * 100) / 100; // Round to 2 decimal places for numbers greater than or equal to 1
    } else if (Math.abs(number) >= 0.1) {
        return Math.round(number * 1000) / 1000; // Round to 3 decimal places for numbers between 0.1 and 1
    } else if (Math.abs(number) >= 0.01) {
        return Math.round(number * 10000) / 10000; // Round to 4 decimal places for numbers between 0.01 and 0.1
    } else if (Math.abs(number) >= 0.001) {
        return Math.round(number * 100000) / 100000; // Round to 5 decimal places for numbers between 0.001 and 0.01
    } else if (Math.abs(number) >= 0.0001) {
        return Math.round(number * 1000000) / 1000000; // Round to 6 decimal places for numbers between 0.0001 and 0.001
    } else if (Math.abs(number) >= 0.00001) {
        return Math.round(number * 10000000) / 10000000; // Round to 7 decimal places for numbers between 0.00001 and 0.0001
    } else {
        return Math.round(number * 100000000) / 100000000; // Round to 8 decimal places for numbers smaller than 0.00001
    }
}

