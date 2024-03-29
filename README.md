# Application Configuration

* Define and initialise Typescript-friendly global read-only application configuration in runtime.

* Populate each config value using either a value (or source of value, e.g. function) (`fromVal`), an inline function (`fromFunc`), or the environment variable parser (`fromEnv`).

* Validate config values using [Zod](https://zod.dev/) schema validation library, optionally using built-in base schemas: `String`, `Number`, `Int`, `BigInt`, and `Boolean`.

## How to Use

1. Create a `config.ts` file:

    This file will define and export your app configuration.

    Import and use `createConfig({...})` to define the configuration.

    ```ts
    import { Boolean, Integer, String, configVar, createConfig, fromEnv, fromFunc, fromVal } from "../src";

    const config = createConfig({
        // config can be sourced from env vars using `fromEnv`
        // "REQUIRED" will ensure error is thrown if env var has not been set
        hostUrl: configVar("Host URL", "REQUIRED", String.url())(fromEnv("HOST")),
        // config can be sourced from (in-line) functions using `fromFunc`
        timeout: configVar("Timeout (in seconds)", "REQUIRED", Int)(fromFunc(()=>{
            const minCeiled = Math.ceil(5);
            const maxFloored = Math.floor(10);
            return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
        })
        ),
        // config can be sourced from pre-defined values or existing functions using `fromVal`
        // this example uses a custom schema
        protocol: configVar("Protocol", "REQUIRED", AvailableProtocol)(fromVal("HTTP")),
        // configs can be nested
        a: {
            b: {
                c: {
                    portNumber: configVar("Port Number", "REQUIRED", Int)(fromEnv("PORT"))
                },
            }
        },
        // env vars can be parsed as boolean, the following (case-insensitive) evaluate to TRUE: "true", "yes", "t", "y"
        // "OPTIONAL" means error will NOT be thrown if env var has not been set, will instead evaluate to FALSE (for boolean schema) or UNDEFINED (for non-boolean schema).
        forceTLS: configVar("Force Transport Layer Security (TLS)", "OPTIONAL", Boolean)(fromEnv("FORCE_TLS"))
    });
    ```

2. Access your configuration from other source files:

    ```ts
    import config from "config.ts"

    console.log(config.a.b.c.portNumber);
    // 8080

    console.log(typeof config.a.b.c.portNumber);
    // number
    ```
