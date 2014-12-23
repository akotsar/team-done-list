/// <reference path="_tests.ts"/>

module TeamDoneList.Tests {
    /**
     * Signs in the user. Expects the sign in page to be open.
     */
    function doSignIn(): void {
        browser.element(by.model('email')).sendKeys('test@email.com');
        element(by.model('password')).sendKeys('password');
        element(by.css('button')).click();
    }

    /**
     * Checks if the user is signed in, signs in if not.
     */
    function ensureSignedIn(): void {
        element(by.css('.menu')).isPresent().then((present) => {
            if (!present) {
                browser.get('index.html#/signin');
                doSignIn();
            }
        });
    }

    /**
     * Checks if the user is signed out, signs out if yes.
     */
    function ensureSignedOut(): void {
        var signOutLink = element(by.partialLinkText('Sign Out'));
        signOutLink.isPresent().then((present) => {
            if (present) signOutLink.click();
        });
    }

    describe('Team Done List', () => {
        browser.get('index.html');
        ensureSignedOut();

        it('should automatically redirect to /home when location hash/fragment is empty and user is not authenticated', () => {
            ensureSignedIn();
            expect(browser.getLocationAbsUrl()).toMatch('/home');
        });

        it('should automatically redirect to /signin when trying to access /home and not being signed in.', () => {
            ensureSignedOut();
            browser.get('index.html#/home');
            expect(browser.getLocationAbsUrl()).toMatch('/signin');
        });

        it('should display Sign Out link when the user is signed in.', () => {
            ensureSignedIn();
            browser.get('index.html#/home');
            expect(element(by.partialLinkText('Sign Out')).isPresent()).toBeTruthy();
        });

        describe('signin', () => {
            beforeEach(() => {
                ensureSignedOut();
                browser.get('index.html#/signin');
            });

            it('should render signin when user navigates to /signin', () => {
                expect(browser.driver.isElementPresent(by.id('email'))).toBeTruthy();
                expect(browser.driver.isElementPresent(by.id('password'))).toBeTruthy();
            });

            it('should sign in the user and navigate to /home', () => {
                doSignIn();
                expect(browser.getLocationAbsUrl()).toMatch('/home');
            });
        });

        describe('home', () => {
            beforeEach(() => {
                ensureSignedIn();
                browser.get('index.html#/home');
            });

            it('should render home when user navigates to /home', () => {
                expect(element.all(by.css('[ui-view] p')).first().getText())
                    .toMatch(/partial for view 1/);
            });

            it('should display greeting', () => {
                expect(element(by.css('[ui-view] h4')).getText())
                    .toMatch(/^Hello, .*\!$/);
            });
        });
    });
}
