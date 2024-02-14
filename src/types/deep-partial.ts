type ExemptObjects = RegExp | Date;

export type DeepPartial<T> = {
    [P in keyof T]?: 
        T[P] extends object ? (T[P] extends ExemptObjects ? T[P] : DeepPartial<T[P]>) : T[P];
};
