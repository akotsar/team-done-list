/// <reference path="_tests.ts"/>

module WhoDidWhat.Tests {
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

        it('should automatically redirect to /account when location hash/fragment is empty and user is not authenticated', () => {
            ensureSignedIn();
            browser.get('index.html');
            expect(browser.getLocationAbsUrl()).toMatch('/account');
        });

        it('should automatically redirect to /signin when trying to access /account and not being signed in.', () => {
            ensureSignedOut();
            browser.get('index.html#/account');
            expect(browser.getLocationAbsUrl()).toMatch('/signin');
        });

        it('should display Sign Out link when the user is signed in.', () => {
            ensureSignedIn();
            browser.get('index.html#/account');
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

            it('should sign in the user and navigate to /account', () => {
                doSignIn();
                expect(browser.getLocationAbsUrl()).toMatch('/account');
            });
        });

        describe('account', () => {
            beforeEach(() => {
                ensureSignedIn();
                browser.get('index.html#/account');
            });

            it('should display greeting', () => {
                expect(element(by.css('[ui-view] h4')).getText())
                    .toMatch(/^Hello, .*\!$/);
            });
        });
    });
}
