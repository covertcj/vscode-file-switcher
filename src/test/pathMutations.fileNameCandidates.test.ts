import * as assert from 'assert';
import { Observable } from 'rxjs';
import { gatherAsArray } from '../observables';
import { fileNameCandidates, fileNameSplits } from '../pathMutations';

const getCandidates = async (
    splits$: Observable<string>,
    extensions: string[]
) => await gatherAsArray(fileNameCandidates(splits$, extensions));

suite('file-switcher/pathMutations/fileNameCandidates', () => {
    const noExt = 'C:/my/path/file';
    let splits$: Observable<string>;

    suite('with only one split', () => {
        setup(() => { splits$ = fileNameSplits(noExt, ['.']); });

        test('when no extensions are specified, there are no candidates', async () => {
            assert.deepEqual(await getCandidates(splits$, []), []);
        });

        test('when a single extension is specified, there should be one candidate', async () => {
            assert.deepEqual(await getCandidates(splits$, ['.html']), [`${noExt}.html`]);
        });

        test('when a two extensions are specified, there should be two candidates', async () => {
            assert.deepEqual(
                await getCandidates(splits$, ['.html', '.js']),
                [`${noExt}.html`, `${noExt}.js`]
            );
        });
    });

    suite('with more than one split', () => {
        const noExtWithSplit = `${noExt}.component`;
        const withExt = `${noExtWithSplit}.js`;

        setup(() => { splits$ = fileNameSplits(withExt, ['.']); });

        test('when no extensions are specified, there are no candidates', async () => {
            assert.deepEqual(await getCandidates(splits$, []), []);
        });

        test('when a single extension is specified, there should be two candidates', async () => {
            assert.deepEqual(
                await getCandidates(splits$, ['.html']),
                [`${withExt}.html`, `${noExtWithSplit}.html`, `${noExt}.html`]
            );
        });

        test('when a two extensions are specified, there should be four candidates', async () => {
            assert.deepEqual(
                await getCandidates(splits$, ['.html', '.js']),
                [`${withExt}.html`, `${withExt}.js`, `${noExtWithSplit}.html`,
                 `${noExtWithSplit}.js`, `${noExt}.html`, `${noExt}.js`]
            );
        });
    });
});