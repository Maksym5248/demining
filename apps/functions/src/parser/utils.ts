export async function importEsmModule<T>(name: string): Promise<T> {
    // FIXME: see https://stackoverflow.com/questions/65265420/how-to-prevent-typescript-from-transpiling-dynamic-imports-into-require
    // eslint-disable-next-line no-eval
    const module = eval(`(async () => {return await import("${name}")})()`);
    return module as T;
}
