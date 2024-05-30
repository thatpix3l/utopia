export type AssertSameKeys<T1 extends Record<keyof T2, any>, T2 extends Record<keyof T1, any>> = never;
