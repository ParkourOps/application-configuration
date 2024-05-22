import { DeepPartial, DeepReadonly } from "./types/deep";

interface ParseOptions {
    trimWhitespace: boolean,
    boolean: {
        truthyValues: RegExp
    }
}

const defaultParseOptions : ParseOptions = {
    trimWhitespace: true,
    boolean: {
        truthyValues: /^(true|yes|t|y)$/i,
    },
};

let _parseOptions : ParseOptions = defaultParseOptions;

export function setParseOptions(parseOptions?: DeepPartial<ParseOptions>) {
    _parseOptions = {
        trimWhitespace: parseOptions?.trimWhitespace ?? defaultParseOptions.trimWhitespace,
        boolean: {
            truthyValues: parseOptions?.boolean?.truthyValues ?? defaultParseOptions.boolean.truthyValues,
        },
    };
}

export function getParseOptions() : DeepReadonly<ParseOptions> {
    return _parseOptions;
}

export default {
    getParseOptions,
    setParseOptions,
};
