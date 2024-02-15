import { EnvironmentVariableNotSetError } from "../src/errors";
import { Number, createConfig, fromEnv, fromFunc, fromVal, configVar } from "../src/index";


test("required variables, number, set", ()=>{
    process.env.C = "333";

    const config = createConfig({
        a: configVar("test number: a", "REQUIRED", Number)(fromVal(111)),
        b: configVar("test number: b", "REQUIRED", Number)(fromFunc(()=>222)),
        c: configVar("test number: c", "REQUIRED", Number)(fromEnv("C")),
    });

    expect(config.a).toBe(111);
    expect(config.b).toBe(222);
    expect(config.c).toBe(333);
});


test("required variables, number, unset", ()=>{
    expect(()=>{
        const config = createConfig({
            // d: configVar("test number: d", "REQUIRED", Number)(fromVal(undefined)),
            // e: configVar("test number: e", "REQUIRED", Number)(fromFunc(()=>undefined)),
            f: configVar("test number: f", "REQUIRED", Number)(fromEnv("F")),
        });
    }).toThrow(EnvironmentVariableNotSetError);
});


test("optional variables, number, set", ()=>{
    process.env.I = "999";

    const config = createConfig({
        g: configVar("test number: g", "OPTIONAL", Number)(fromVal(777)),
        h: configVar("test number: h", "OPTIONAL", Number)(fromFunc(()=>888)),
        i: configVar("test number: i", "OPTIONAL", Number)(fromEnv("I")),
    });

    expect(config.g).toBe(777);
    expect(config.h).toBe(888);
    expect(config.i).toBe(999);
});


test("optional variables, number, unset", ()=>{
    const config = createConfig({
        j: configVar("test number: j", "OPTIONAL", Number)(fromVal(undefined)),
        k: configVar("test number: k", "OPTIONAL", Number)(fromFunc(()=>undefined)),
        l: configVar("test number: l", "OPTIONAL", Number)(fromEnv("L")),
    });

    expect(config.j).toBe(undefined);
    expect(config.k).toBe(undefined);
    expect(config.l).toBe(undefined);
});
