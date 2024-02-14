import { DeepPartial } from "./types/deep-partial";

type ParseOptions = {
    environmentVariables: {
        trimWhitespace: boolean,
        boolean: {
            truthyValues: RegExp
        }
    }
}

const defaultParseOptions : ParseOptions = {
    environmentVariables: {
        trimWhitespace: true,
        boolean: {
            truthyValues: /^(true|yes|t|y)$/i,
        }
    }
}

let _parseOptions : ParseOptions = defaultParseOptions;

export function setParseOptions(parseOptions?: DeepPartial<ParseOptions>) {
    _parseOptions = {
        environmentVariables: {
            trimWhitespace: parseOptions?.environmentVariables?.trimWhitespace ?? defaultParseOptions.environmentVariables.trimWhitespace,
            boolean: {
                truthyValues: parseOptions?.environmentVariables?.boolean?.truthyValues ?? defaultParseOptions.environmentVariables.boolean.truthyValues,
            }
        }
    };
}

export default _parseOptions;
