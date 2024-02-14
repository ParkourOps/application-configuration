import {Number, String, createConfig, fromEnvString, fromEnvBool, fromFunc, fromVal, optionalVar, requiredVar} from "../src/index";

test("A required string configuration", ()=>{
    const config = createConfig({
        a: requiredVar(String)(fromVal("aaa")),
        b: requiredVar(String)(fromFunc(()=>"bbb")),
        c: requiredVar(String)(fromEnvString("PORT")),
    });

    console.log(config);
    expect(config.b)
});

