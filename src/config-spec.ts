import { optionalConfigVar, requiredConfigVar } from "./config-var";

type ConfigSpec = {
    [Key: string]: ConfigSpec | ReturnType<ReturnType<typeof requiredConfigVar>> | ReturnType<ReturnType<typeof optionalConfigVar>>
};

export function createConfig<Spec extends ConfigSpec>(specification: Spec) {
    return specification;
}
