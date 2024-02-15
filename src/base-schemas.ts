import { z } from "zod";

export const String = z.coerce.string();
export const Number = z.coerce.number();
export const Int = Number.int();
export const BigInt = z.coerce.bigint();
export const Boolean = z.coerce.boolean();
