import * as assert from 'assert';
// import { Observable } from 'rxjs';
import { gatherAsArray } from '../observables';
import { getCycleCandidates } from '../cycleExtensions';

const getCandidates = async (
    path: string,
    seperators: string[],
    extensions: string[]
) => await gatherAsArray(getCycleCandidates(path, seperators, extensions));

suite('file-switcher/cycleExtensions/getCycleCandidates', () => {
    test('when no extensions are specified, there are no candidates', async () => {
        assert.deepEqual(await getCandidates('test', ['.'], []), []);
    });

    test('when cycling "test.js" with 2 extensions', async () => {
        assert.deepEqual(
            await getCandidates('test.js', ['.'], ['.html', '.js']),
            ['test.js.html', 'test.js.js', 'test.html']
        );
    });

    test('when cycling "test.html" with 2 extensions', async () => {
        assert.deepEqual(
            await getCandidates('test.html', ['.'], ['.html', '.js']),
            ['test.js', 'test.html.html', 'test.html.js']
        );
    });

    test('when cycling "test.js" with 3 extensions', async () => {
        assert.deepEqual(
            await getCandidates('test.js', ['.'], ['.html', '.js', '.css']),
            ['test.css', 'test.js.html', 'test.js.js', 'test.js.css', 'test.html']
        );
    });

    test('when cycling "test-component.js" with 3 extensions', async () => {
        assert.deepEqual(
            await getCandidates('test-component.js', ['.', '-'], ['.html', '.js', '.css']),
            ['test-component.css', 'test.html', 'test.js', 'test.css', 'test-component.js.html',
             'test-component.js.js', 'test-component.js.css', 'test-component.html']
        );
    });
});
