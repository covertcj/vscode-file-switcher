Candidate Detection and Selection
=================================

1. Strip off the extension and remove strippable folders/suffixes. 
    ```typescript
    (path: string) => string[]
    ```

  * Strip the extension with something like: `/(.*)\.[^.]+/`
    * Append to the results array
  * Check to see if the path has a strippable suffix
    * If it does, append the stripped path to the results array
  * Check to see if the path can be mapped to another folder
    * If it can, append any mapped folders to the results array

  > If mapping to a specific extension, we can take this results array and
  > switch to the first one that tests as a valid file.

2. Enumerate the possible completions from the resultant paths based on
   files in the current folder.

    ```typescript
    (results: string[]) => string[]
    ```

    An example of this might be
    ```typescript
    ['/src/myComponentSpec', '/src/myComponent'] => [
        '/src/myComponentSpec.js',
        '/src/myComponent.css',
        '/src/myComponent.html',
        '/src/myComponent.js'
    ]
    ```

3. Sort the files alphabetically in order to get a reproducible order
4. Strip all paths up to and including the current file from the array,
   and append them to the end of the array.
5. Pick the first file in the list, and switch to it.