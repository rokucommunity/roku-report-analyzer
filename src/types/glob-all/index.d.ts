declare module 'glob-all' {
    import type { IOptions } from 'glob';
    export function sync(patterns: string[], options: IOptions): string[];
}
