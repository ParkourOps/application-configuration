import { EnvironmentVariableNotSetError } from "../src/errors";
import { Boolean, createConfig, fromEnv, fromFunc, fromVal, configVar } from "../src/index";

test("required variables, boolean, set", ()=>{
    process.env.E = "t";
    process.env.F = "f";

    const config = createConfig({
        a: configVar("test boolean: a", "REQUIRED", Boolean)(fromVal(true)),
        b: configVar("test boolean: b", "REQUIRED", Boolean)(fromVal(false)),
        c: configVar("test boolean: c", "REQUIRED", Boolean)(fromFunc(()=>true)),
        d: configVar("test boolean: d", "REQUIRED", Boolean)(fromFunc(()=>false)),
        e: configVar("test boolean: e", "REQUIRED", Boolean)(fromEnv("E")),
        f: configVar("test boolean: f", "REQUIRED", Boolean)(fromEnv("F")),
    });

    expect(config.a).toBe(true);
    expect(config.b).toBe(false);
    expect(config.c).toBe(true);
    expect(config.d).toBe(false);
    expect(config.e).toBe(true);
    expect(config.f).toBe(false);
});


test("required variables, boolean, unset", ()=>{
    expect(()=>{
        const config = createConfig({
            // g: configVar("test boolean: g", "REQUIRED", Boolean)(fromVal(undefined)),
            // h: configVar("test boolean: h", "REQUIRED", Boolean)(fromFunc(()=>undefined)),
            i: configVar("test boolean: i", "REQUIRED", Boolean)(fromEnv("I")),
        });
    
    }).toThrow(EnvironmentVariableNotSetError);
});


test("optional variables, boolean, set", ()=>{
    process.env.N = "t";
    process.env.O = "f";

    const config = createConfig({
        j: configVar("test boolean: j", "OPTIONAL", Boolean)(fromVal(true)),
        k: configVar("test boolean: k", "OPTIONAL", Boolean)(fromVal(false)),
        l: configVar("test boolean: l", "OPTIONAL", Boolean)(fromFunc(()=>true)),
        m: configVar("test boolean: m", "OPTIONAL", Boolean)(fromFunc(()=>false)),
        n: configVar("test boolean: n", "OPTIONAL", Boolean)(fromEnv("N")),
        o: configVar("test boolean: o", "OPTIONAL", Boolean)(fromEnv("O")),
    });

    expect(config.j).toBe(true);
    expect(config.k).toBe(false);
    expect(config.l).toBe(true);
    expect(config.m).toBe(false);
    expect(config.n).toBe(true);
    expect(config.o).toBe(false);
});


test("optional variables, boolean, unset", ()=>{
    const config = createConfig({
        p: configVar("test boolean: j", "OPTIONAL", Boolean)(fromVal(undefined)),
        q: configVar("test boolean: k", "OPTIONAL", Boolean)(fromVal(undefined)),
        r: configVar("test boolean: l", "OPTIONAL", Boolean)(fromFunc(()=>undefined)),
        s: configVar("test boolean: m", "OPTIONAL", Boolean)(fromFunc(()=>undefined)),
        t: configVar("test boolean: n", "OPTIONAL", Boolean)(fromEnv("T")),
        u: configVar("test boolean: o", "OPTIONAL", Boolean)(fromEnv("U")),
    });

    expect(config.p).toBe(false);
    expect(config.q).toBe(false);
    expect(config.r).toBe(false);
    expect(config.s).toBe(false);
    expect(config.t).toBe(false);
    expect(config.u).toBe(false);
});

test("boolean parsing from environment variables", ()=>{
    process.env.AA = "t";
    process.env.BB = "true";
    process.env.CC = "y";
    process.env.DD = "yes";
    process.env.EE = "n";
    process.env.FF = "no";
    process.env.GG = "zzz";
    process.env.HH = "";

    const config = createConfig({
        aa: configVar("test boolean: aa", "REQUIRED", Boolean)(fromEnv("AA")),
        bb: configVar("test boolean: bb", "REQUIRED", Boolean)(fromEnv("BB")),
        cc: configVar("test boolean: cc", "REQUIRED", Boolean)(fromEnv("CC")),
        dd: configVar("test boolean: dd", "REQUIRED", Boolean)(fromEnv("DD")),
        ee: configVar("test boolean: ee", "REQUIRED", Boolean)(fromEnv("EE")),
        ff: configVar("test boolean: ff", "REQUIRED", Boolean)(fromEnv("FF")),
        gg: configVar("test boolean: gg", "REQUIRED", Boolean)(fromEnv("GG")),
        hh: configVar("test boolean: hh", "OPTIONAL", Boolean)(fromEnv("HH")),
        ii: configVar("test boolean: ii", "OPTIONAL", Boolean)(fromEnv("II")),
    });

    expect(config.aa).toBe(true);
    expect(config.bb).toBe(true);
    expect(config.cc).toBe(true);
    expect(config.dd).toBe(true);
    expect(config.ee).toBe(false);
    expect(config.ff).toBe(false);
    expect(config.gg).toBe(false);
    expect(config.hh).toBe(false);
    expect(config.ii).toBe(false);
});