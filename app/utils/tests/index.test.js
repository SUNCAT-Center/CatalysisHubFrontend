import { download } from '../index';

describe('download', () => {
  it('should create a download link', () => {
    expect(download('http://localhost/')).toMatchSnapshot();
  });
});
