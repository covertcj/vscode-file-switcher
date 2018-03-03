import * as assert from 'assert';
import { filter } from '../promiseUtil';

suite('file-switcher/promiseUtil/filter', () => {
    test('filtering an empty arry', async () => {
        assert.deepEqual(await filter([], async () => true), []);
    });

    test('filtering an array with a return true predicate', async () => {
        assert.deepEqual(
            await filter(['test', 'test2'], async () => true),
            ['test', 'test2']
        );
    });

    test('filtering an array with a return false predicate', async () => {
        assert.deepEqual(
            await filter(['test', 'test2'], async () => false),
            []
        );
    });

    test('filtering an array with a real predicate', async () => {
        assert.deepEqual(
            await filter(['test', 'nottest', 'test2'], async (v) => v.startsWith('test')),
            ['test', 'test2']
        );
    });
});