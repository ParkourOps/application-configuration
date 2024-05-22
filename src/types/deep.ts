// The following source code is from: https://github.com/ts-essentials/ts-essentials
//
// The MIT License

// Copyright (c) 2018-2019 Chris Kaczor (github.com/krzkaczor)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// eslint-disable-next-line @typescript-eslint/array-type
export type AnyArray<Type = any> = Array<Type> | ReadonlyArray<Type>;
export type IsTuple<Type> = Type extends readonly any[] ? (any[] extends Type ? never : Type) : never;
export type IsAny<Type> = 0 extends 1 & Type ? true : false; // https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsUnknown<Type> = IsAny<Type> extends true ? false : unknown extends Type ? true : false;
export type Primitive = string | number | boolean | bigint | symbol | undefined | null;
export type Builtin = Primitive | Function | Date | Error | RegExp;

export type DeepReadonly<Type> = Type extends Exclude<Builtin, Error>
  ? Type
  : Type extends Map<infer Keys, infer Values>
  ? ReadonlyMap<DeepReadonly<Keys>, DeepReadonly<Values>>
  : Type extends ReadonlyMap<infer Keys, infer Values>
  ? ReadonlyMap<DeepReadonly<Keys>, DeepReadonly<Values>>
  : Type extends WeakMap<infer Keys, infer Values>
  ? WeakMap<DeepReadonly<Keys>, DeepReadonly<Values>>
  : Type extends Set<infer Values>
  ? ReadonlySet<DeepReadonly<Values>>
  : Type extends ReadonlySet<infer Values>
  ? ReadonlySet<DeepReadonly<Values>>
  : Type extends WeakSet<infer Values>
  ? WeakSet<DeepReadonly<Values>>
  : Type extends Promise<infer Value>
  ? Promise<DeepReadonly<Value>>
  : Type extends AnyArray<infer Values>
  ? Type extends IsTuple<Type>
    ? { readonly [Key in keyof Type]: DeepReadonly<Type[Key]> }
    // eslint-disable-next-line @typescript-eslint/array-type
    : ReadonlyArray<DeepReadonly<Values>>
  : Type extends {}
  ? { readonly [Key in keyof Type]: DeepReadonly<Type[Key]> }
  : IsUnknown<Type> extends true
  ? unknown
  : Readonly<Type>;

export type DeepPartial<Type> = Type extends Exclude<Builtin, Error>
  ? Type
  : Type extends Map<infer Keys, infer Values>
  ? Map<DeepPartial<Keys>, DeepPartial<Values>>
  : Type extends ReadonlyMap<infer Keys, infer Values>
  ? ReadonlyMap<DeepPartial<Keys>, DeepPartial<Values>>
  : Type extends WeakMap<infer Keys, infer Values>
  ? WeakMap<DeepPartial<Keys>, DeepPartial<Values>>
  : Type extends Set<infer Values>
  ? Set<DeepPartial<Values>>
  : Type extends ReadonlySet<infer Values>
  ? ReadonlySet<DeepPartial<Values>>
  : Type extends WeakSet<infer Values>
  ? WeakSet<DeepPartial<Values>>
  // eslint-disable-next-line @typescript-eslint/array-type
  : Type extends ReadonlyArray<infer Values>
  ? Type extends IsTuple<Type>
    // eslint-disable-next-line @typescript-eslint/array-type
    ? { [Key in keyof Type]?: DeepPartial<Type[Key]> }
    // eslint-disable-next-line @typescript-eslint/array-type
    : Type extends Array<Values>
    // eslint-disable-next-line @typescript-eslint/array-type
    ? Array<DeepPartial<Values> | undefined>
    // eslint-disable-next-line @typescript-eslint/array-type
    : ReadonlyArray<DeepPartial<Values> | undefined>
  : Type extends Promise<infer Value>
  ? Promise<DeepPartial<Value>>
  : Type extends {}
  ? { [Key in keyof Type]?: DeepPartial<Type[Key]> }
  : IsUnknown<Type> extends true
  ? unknown
  : Partial<Type>;