import { EnvironmentVariableNotSetError } from "../src/errors";
import { BigInt, createConfig, fromEnv, fromFunc, fromVal, configVar } from "../src/index";


test("required variables, bigint, set", ()=>{
    process.env.C = "333";

    const config = createConfig({
        a: configVar("test number: a", "REQUIRED", BigInt)(fromVal(111n)),
        b: configVar("test number: b", "REQUIRED", BigInt)(fromFunc(()=>222n)),
        c: configVar("test number: c", "REQUIRED", BigInt)(fromEnv("C")),
    });
 
    expect(config.a).toBe(111n);
    expect(config.b).toBe(222n);
    expect(config.c).toBe(333n);
});


test("required variables, bigint, unset", ()=>{
    expect(()=>{
        const config = createConfig({
            // d: configVar("test number: d", "REQUIRED", BigInt)(fromVal(undefined)),
            // e: configVar("test number: e", "REQUIRED", BigInt)(fromFunc(()=>undefined)),
            f: configVar("test number: f", "REQUIRED", BigInt)(fromEnv("F")),
        });
    }).toThrow(EnvironmentVariableNotSetError);
});


test("optional variables, bigint, set", ()=>{
    process.env.I = "999";

    const config = createConfig({
        g: configVar("test number: g", "OPTIONAL", BigInt)(fromVal(777n)),
        h: configVar("test number: h", "OPTIONAL", BigInt)(fromFunc(()=>888n)),
        i: configVar("test number: i", "OPTIONAL", BigInt)(fromEnv("I")),
    });

    expect(config.g).toBe(777n);
    expect(config.h).toBe(888n);
    expect(config.i).toBe(999n);
});


test("optional variables, bigint, unset", ()=>{
    const config = createConfig({
        j: configVar("test number: j", "OPTIONAL", BigInt)(fromVal(undefined)),
        k: configVar("test number: k", "OPTIONAL", BigInt)(fromFunc(()=>undefined)),
        l: configVar("test number: l", "OPTIONAL", BigInt)(fromEnv("L")),
    });

    expect(config.j).toBe(undefined);
    expect(config.k).toBe(undefined);
    expect(config.l).toBe(undefined);
});
