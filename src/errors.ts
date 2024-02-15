/**
 * Thrown when the configuration value can not be parsed.
 */
export class InvalidConfigurationValueError extends Error {
    constructor(name: string, value: unknown) {
        super(`Invalid configuration value: ${name} = ${value}`);
    }
}

/**
 * Thrown when a configuration value can not be extracted from the environment variable because it has not been set.
 */
export class EnvironmentVariableNotSetError extends Error {
    constructor(key: string) {
        super(`Required environment variable not set: ${key}`);
    }
}

/**
 * Thrown when the configuration value has not been assigned a source from which to extract the value.
 */
export class ConfigurationValueSourceUndefinedError extends Error {
    constructor(name: string) {
        super(`Source not defined for configuration value: ${name}`);
    }
}
