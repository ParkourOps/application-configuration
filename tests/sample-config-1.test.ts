import { z } from "zod";
import { Boolean, Int, String, configVar, createConfig, fromEnv, fromFunc, fromVal } from "../src";

test("sample configuration #1", ()=>{
    process.env.PORT = "8080";
    process.env.HOST = "http://127.0.0.1";
    process.env.FORCE_TLS = "t";

    const AvailableProtocol = z.union([
        z.literal("HTTP"),
        z.literal("WebSocket"),
    ]);

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
                    portNumber: configVar("Port Number", "REQUIRED", Int)(fromEnv("PORT")),
                },
            },
        },
        // env vars can be parsed as boolean, the following (case-insensitive) evaluate to TRUE: "true", "yes", "t", "y"
        // "OPTIONAL" means error will NOT be thrown if env var has not been set, will instead evaluate to FALSE (for boolean schema) or UNDEFINED (for non-boolean schema).
        forceTLS: configVar("Force Transport Layer Security (TLS)", "OPTIONAL", Boolean)(fromEnv("FORCE_TLS")),
    });

    expect(config.hostUrl).toBe("http://127.0.0.1");
    expect(config.timeout).toBeGreaterThanOrEqual(5);
    expect(config.timeout).toBeLessThanOrEqual(10);
    expect(config.protocol).toBe("HTTP");
    expect(config.a.b.c.portNumber).toBe(8080);
    expect(config.forceTLS).toBe(true);
});
