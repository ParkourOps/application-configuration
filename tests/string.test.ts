import { EnvironmentVariableNotSetError } from "../src/errors";
import { String, createConfig, fromEnv, fromFunc, fromVal, configVar } from "../src/index";


test("required variables, string, set", ()=>{
    process.env.C = "ccc";

    const config = createConfig({
        a: configVar("test string: a", "REQUIRED", String)(fromVal("aaa")),
        b: configVar("test string: b", "REQUIRED", String)(fromFunc(()=>"bbb")),
        c: configVar("test string: c", "REQUIRED", String)(fromEnv("C")),
    });

    expect(config.a).toBe("aaa");
    expect(config.b).toBe("bbb");
    expect(config.c).toBe("ccc");
});


test("required variables, string, unset", ()=>{
    expect(()=>{
        const config = createConfig({
            // d: configVar("test string: d", "REQUIRED", String)(fromVal(undefined)),
            // e: configVar("test string: e", "REQUIRED", String)(fromFunc(()=>undefined)),
            f: configVar("test string: f", "REQUIRED", String)(fromEnv("F")),
        });
    }).toThrow(EnvironmentVariableNotSetError);
});


test("optional variables, string, set", ()=>{
    process.env.I = "iii";

    const config = createConfig({
        g: configVar("test string: g", "OPTIONAL", String)(fromVal("ggg")),
        h: configVar("test string: h", "OPTIONAL", String)(fromFunc(()=>"hhh")),
        i: configVar("test string: i", "OPTIONAL", String)(fromEnv("I")),
    });

    expect(config.g).toBe("ggg");
    expect(config.h).toBe("hhh");
    expect(config.i).toBe("iii");
});


test("optional variables, string, unset", ()=>{
    const config = createConfig({
        j: configVar("test string: j", "OPTIONAL", String)(fromVal(undefined)),
        k: configVar("test string: k", "OPTIONAL", String)(fromFunc(()=>undefined)),
        l: configVar("test string: l", "OPTIONAL", String)(fromEnv("L")),
    });

    expect(config.j).toBe(undefined);
    expect(config.k).toBe(undefined);
    expect(config.l).toBe(undefined);
});
