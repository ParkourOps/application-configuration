import { ZodType, ZodTypeDef } from "zod";
import { ConfigVarSource, ConfigVarEnvSource } from "./config-var-source";
import { InvalidConfigurationValueError } from "./errors";

export type ConfigVarKey = string;

export const requiredConfigVar = <
    Output,
    Def extends ZodTypeDef,
    Input
>(
    schema: ZodType<Output, Def, Input>
) => (
    source: ConfigVarSource<Output> | ConfigVarEnvSource
) => {
    const rawValue = source.get();
    const validationResult = schema.safeParse(rawValue);
    if (!validationResult.success) {
        throw new InvalidConfigurationValueError();
    }
    return validationResult.data;
};

export const optionalConfigVar = <
    Output,
    Def extends ZodTypeDef,
    Input
>(
    schema: ZodType<Output, Def, Input>
) => (
    source?: ConfigVarSource<Output> | ConfigVarEnvSource
) => {
    let value : Output | undefined | null = undefined;
    if (source) {
        const rawValue = source.get();
        if (!rawValue) { return undefined; }
        const validationResult = schema.safeParse(rawValue);
        if (!validationResult.success) {
            throw new InvalidConfigurationValueError();
        } else {
            value = validationResult.data;
        }
    }
    return value;
};
