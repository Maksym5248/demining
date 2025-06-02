import { get, set } from 'idb-keyval';

export async function cacheAsset(uri: string): Promise<Blob | null> {
    if (!uri) return null;
    const cached = await get(uri);

    if (cached) return cached as Blob;

    const response = await fetch(uri);
    const blob = await response.blob();
    await set(uri, blob);
    return blob;
}
