import * as assert from 'assert';

import { fileNameSplits } from '../pathMutations';
import { gatherAsArray } from '../observables';

const getSplits = async (path: string, exts: string[]): Promise<string[]> =>
    await gatherAsArray(fileNameSplits(path, exts));

suite('file-switcher/pathMutations/fileNameSplits', () => {
    const pathWithoutExt = 'C:/my/path/file';
    const pathWithSepsInDir = 'C:/my.path/file';
    const pathWithOtherSlashes = pathWithSepsInDir.replace(/\//g, '\\');

    test('splitting without separators should not split anything', async () => {
        assert.deepEqual(await getSplits(`${pathWithoutExt}`, []), [pathWithoutExt]);
    });

    test('splitting with a single separator should split out two results', async () => {
        const path = `${pathWithoutExt}.txt`;
        assert.deepEqual(await getSplits(path, ['.']), [path, pathWithoutExt]);
    });

    test('splitting two separators should split out three results', async () => {
        const partialPath = `${pathWithoutExt}.component`;
        const path = `${partialPath}.txt`;
        assert.deepEqual(await getSplits(path, ['.']), [path, partialPath, pathWithoutExt]);
    });

    test('splitting should support multiple separator types', async () => {
        const partialPath = `${pathWithoutExt}-component`;
        const path = `${partialPath}.txt`;
        assert.deepEqual(await getSplits(path, ['.', '-']), [path, partialPath, pathWithoutExt]);
    });

    test('splitting should ignore separators that are part of directory names', async () => {
        const partialPath = `${pathWithSepsInDir}-component`;
        const path = `${partialPath}.txt`;
        assert.deepEqual(await getSplits(path, ['.', '-']), [path, partialPath, pathWithSepsInDir]);
    });

    test('splitting should support both types of directory separator', async () => {
        const partialPath = `${pathWithOtherSlashes}-component`;
        const path = `${partialPath}.txt`;
        assert.deepEqual(await getSplits(path, ['.', '-']), [path, partialPath, pathWithOtherSlashes]);
    });
});