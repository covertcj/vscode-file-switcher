import * as assert from 'assert';
import { stripSuffixes } from '../pathUtil';

suite('file-switcher/pathUtil', () => {
    suite('strippableSuffixes', () => {
        test('when there are no strippable suffixes, the path shouldn\'t change', () => {
            assert.equal(stripSuffixes('my/path.test', []), 'my/path.test');
        });

        test('when there is a strippable suffix and the file has that suffix, strip it', () => {
            assert.equal(stripSuffixes('my/path.test', ['.test']), 'my/path');
        });

        test('when there are more than 1 strippable suffix and the file has the second suffix, strip it', () => {
            assert.equal(stripSuffixes('my/pathSpec', ['.test', 'Spec']), 'my/path');
        });

        test('when the path contains both suffixes, only strip one', () => {
            assert.equal(stripSuffixes('my/pathSpec.test', ['.test', 'Spec']), 'my/pathSpec');
        });

        test('when the suffix contains regex patterns, they should work', () => {
            assert.equal(stripSuffixes('my/path_test', ['[_.]test']), 'my/path');
        });

        test('when the path contains a suffix earlier in the path, don\'t strip it', () => {
            assert.equal(stripSuffixes('my.test/path.test', ['.test', 'Spec']), 'my.test/path');
        });
    });
});