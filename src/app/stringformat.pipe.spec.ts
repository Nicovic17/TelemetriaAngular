import { StrRemUnderscore } from './stringformat.pipe';

describe('StrRemUnderscore', () => {
  it('create an instance', () => {
    const pipe = new StrRemUnderscore();
    expect(pipe).toBeTruthy();
  });
});
