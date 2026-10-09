import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('font delivery', () => {
  it('imports only the Latin subsets needed by the site copy', () => {
    const css = readFileSync(new URL('../../src/styles/global.css', import.meta.url), 'utf8');

    expect(css).toContain('@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2');
    expect(css).toContain('@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2');
    expect(css).not.toContain("@import '@fontsource-variable/");
  });
});
