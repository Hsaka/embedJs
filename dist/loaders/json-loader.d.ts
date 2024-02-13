import { BaseLoader } from '../interfaces/base-loader.js';
export declare class JsonLoader extends BaseLoader<{
    type: 'JsonLoader';
}> {
    private readonly object;
    private readonly pickKeysForEmbedding;
    constructor({ object, pickKeysForEmbedding, }: {
        object: Record<string, unknown> | Record<string, unknown>[];
        pickKeysForEmbedding: string[];
    });
    getChunks(): AsyncGenerator<{
        pageContent: string;
        contentHash: string;
        metadata: {
            type: "JsonLoader";
            source: string;
        };
    }, void, unknown>;
}
