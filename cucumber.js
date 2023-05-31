module.exports = {
  default: [
    // `--format-options '{"snippetInterface": "synchronous"}'`,
    '--parallel 1',
    // '--format progress-bar',
    // '--format usage',
    // '--format snippets',
    '--format summary',
    '--publish-quiet',
    // '--require-module ts-node/register',
    // '--require ./src/features/**/*.ts',
    // '--require ./src/features/*.ts',
  ].join(' '),
};
