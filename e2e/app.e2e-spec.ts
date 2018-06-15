import { MadamemacdonaldGamesPage } from './app.po';

describe('madamemacdonald-games App', function() {
  let page: MadamemacdonaldGamesPage;

  beforeEach(() => {
    page = new MadamemacdonaldGamesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
