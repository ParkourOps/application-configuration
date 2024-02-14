import { parse } from "url";
import parseOptions from "./parse-options";

export type BaseConfigVarSource<TypeKey, T> = {
    type: TypeKey,
    get: ()=>T
}
export type ConfigVarFuncSource<T> = BaseConfigVarSource<"func", T>;
export type ConfigVarValSource<T> = BaseConfigVarSource<"val", T>;
export type ConfigVarSource<T> = ConfigVarValSource<T> | ConfigVarFuncSource<T>;

export type ConfigVarEnvSourceString = BaseConfigVarSource<"env:string", string | undefined>;
export type ConfigVarEnvSourceBoolean = BaseConfigVarSource<"env:boolean", boolean | undefined>;
export type ConfigVarEnvSource = ConfigVarEnvSourceString | ConfigVarEnvSourceBoolean;

export const fromFunc = <
    T
>(
    func: ()=>T
) : ConfigVarFuncSource<T> => ({
    type: "func",
    get() {
        return func();
    },
});

export const fromVal = <
    T
>(
    value: T
) : ConfigVarValSource<T> => ({
    type: "val",
    get() {
        return value;
    },
});

const getEnvVar = (key: string) => {
    let value = process.env[key];
    if (value && parseOptions.environmentVariables.trimWhitespace) {
        value = value.trim();
    }
    return value;
}

export const fromEnvString = (
    key: string
) : ConfigVarEnvSourceString => ({
    type: "env:string",
    get() {
        return getEnvVar(key);
    }
});

export const fromEnvBool = (
    key: string
) : ConfigVarEnvSourceBoolean => ({
    type: "env:boolean",
    get() {
        const rawValue = getEnvVar(key);
        if (rawValue && parseOptions.environmentVariables.boolean.truthyValues.test(rawValue)) {
            return true;
        } else {
            return false;
        }
    }
});
