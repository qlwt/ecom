export const promise_waitfor = async function <Src>(src: Src): Promise<Src extends Promise<infer T> ? T : Src> {
    if (src instanceof Promise) {
        return await src as any
    }

    return src as any
}
