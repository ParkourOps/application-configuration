import { ZodBoolean, ZodType, ZodTypeDef } from "zod";
import { getParseOptions } from "./parse-options";
import { EnvironmentVariableNotSetError, InvalidConfigurationValueError } from "./errors";
import { DeepReadonly } from "./types/deep";
export { String, Number, Int, BigInt, Boolean } from "./base-schemas";

const parseOptions = getParseOptions();

type RequiredConfigVarSource<T> =  
{
    type: "value",
    value: T
} | {
    type: "function",
    func: ()=>T
} | {
    type: "env",
    key: string,
}

type OptionalConfigVarSource<T> =  
{
    type: "value",
    value: T | undefined
} | {
    type: "function",
    func: ()=>T | undefined
} | {
    type: "env",
    key: string,
}

export const fromVal = <T>(value: T) : RequiredConfigVarSource<T> => ({
    type: "value",
    value,
});

export const fromFunc = <T>(func: ()=>T) : RequiredConfigVarSource<T>  => ({
    type: "function",
    func,
});

export const fromEnv = <T>(key: string) : RequiredConfigVarSource<T> => ({
    type: "env",
    key,
});

type ConfigVarSourceByPresence<Presence extends "REQUIRED" | "OPTIONAL", Output> = 
    Presence extends "REQUIRED" ? RequiredConfigVarSource<Output> : Presence extends "OPTIONAL" ? OptionalConfigVarSource<Output> : never;

// type ConfigVar<
//     Name extends string,
//     Presence extends "REQUIRED" | "OPTIONAL",
//     Output,
//     Def extends ZodTypeDef,
//     Input
// > = {
//     name: Name,
//     presence: Presence,
//     schema: ZodType<Output, Def, Input>,
//     source: ConfigVarSourceByPresence<Presence, Output>,
// }

const extractValueFromSource = <
    Output,
    Def extends ZodTypeDef,
    Input
>(
        schema: ZodType<Output, Def, Input>,
        source: RequiredConfigVarSource<Output> | OptionalConfigVarSource<Output>,
        required: boolean
    ) => {
    const isBoolean = schema instanceof ZodBoolean;
    let value;
    switch (source.type) {
    case "value":
        value = source.value;
        break;
    case "function":
        value = source.func();
        break;
    case "env":
        value = process.env[source.key];
        if (!value && required) {
            throw new EnvironmentVariableNotSetError(source.key);
        }
        break;
    }
    // trim if value is string
    if (typeof value === "string" && parseOptions.trimWhitespace) {
        value = value.trim();
    }
    // handle boolean case (forces binary return)
    if (isBoolean) {
        return value ? parseOptions.boolean.truthyValues.test(value as string) : false;
    }
    // handle others
    else {
        return value;
    }
};

export const configVar = <
    Name extends string,
    Presence extends "REQUIRED" | "OPTIONAL",
    Output,
    Def extends ZodTypeDef,
    Input
>(
        name: Name,
        presence: Presence,
        schema: ZodType<Output, Def, Input>
    ) => (
        source: ConfigVarSourceByPresence<Presence, Output>
    ) : Presence extends "REQUIRED" ? Output : (Output | undefined) => {
        const rawValue = extractValueFromSource(schema, source, (presence === "REQUIRED"));
        if (rawValue === undefined && presence === "REQUIRED") {
            throw new InvalidConfigurationValueError(name, rawValue);
        }
        else if (rawValue === undefined && presence === "OPTIONAL") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        }
        else {
            const parseResult = schema.safeParse(rawValue);
            if (!parseResult.success) {
                throw new InvalidConfigurationValueError(name, rawValue);
            } else {
                return parseResult.data;
            }
        }
    };

interface ConfigSpec {
    [Key: string]: ConfigSpec | string | number | bigint | boolean | undefined
}

export function createConfig<Spec extends ConfigSpec>(specification: Spec) {
    Object.freeze(specification);
    return specification as DeepReadonly<Spec>;
}
