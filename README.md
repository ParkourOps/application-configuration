# Configuration Manager

A fully-typed package to manage (define, initialise, validate, and access) application configurations as in-memory state.

Zod schemas are used to validate configuration variables.

## How to Use

1. Create a `config.ts` file:

    This file defines and exports your configuration.

    ```ts
    import {z} from "zod"
    import {createConfig, fromEnv, fromFunc, fromVal} from "@parkour-ops/configuration-manager"

    export default createConfig({
        /* Define your configuration... */
        
        // configuration variables can be sources from a default value
        test_a: {
            schema: z.number(),
            source: fromVal(1.230)
        }

        // configuration variables can be sourced from environment variables
        test_b: {
            schema: z.number(),
            source: fromEnv("TEST_B")
        }

        // configuration variables can be sources from functions
        test: {
            schema: z.string().min(1),
            source: fromFunc(()=>{
                return "Hello, world."
            })
        }
    });
    ```

2. Access your configuration from other source files:

    ```ts
    import config from "config.ts"

    console.log(config.test);
    // 1.230
    ```
