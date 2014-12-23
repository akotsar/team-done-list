/// <reference path="../../_app_test.ts" />
/// <reference path="auth-data-storage.ts" />

module WhoDidWhat.Auth.Storage.Test {
    describe('whoDidWhat.auth.storage module', () => {

        beforeEach(module('whoDidWhat.auth.storage'));

        describe('AuthDataStorage service', () => {
            // Declaring variables and preparing mocks.
            var authDataStorage: AuthDataStorage,
                authData = {
                    access_token: 'test_token',
                    name: 'Test User'
                },
                tempStorage: any,
                localStorageServiceMock = {
                    get() {
                        return tempStorage;
                    },
                    set(a, b) {
                        tempStorage = b;
                    },
                    remove() {
                        tempStorage = undefined;
                    }
                };

            beforeEach(inject(($injector: ng.auto.IInjectorService) => {
                tempStorage = undefined;
                authDataStorage = $injector.instantiate(AuthDataStorage, {
                    localStorageService: localStorageServiceMock
                });
            }));

            it('should store authentication data', () => {
                spyOn(localStorageServiceMock, 'set').andCallThrough();

                authDataStorage.setAuthData(authData);

                expect(localStorageServiceMock.set).toHaveBeenCalledWith('authData', JSON.stringify(authData));
            });

            it('should retrieve authentication data', () => {
                expect(authDataStorage.getAuthData()).toBeUndefined();

                spyOn(localStorageServiceMock, 'get').andCallThrough();

                authDataStorage.setAuthData(authData);
                expect(authDataStorage.getAuthData()).toEqual(authData);
                expect(localStorageServiceMock.get).toHaveBeenCalledWith('authData');
            });

            it('should remove authentication data', () => {
                authDataStorage.setAuthData(authData);
                expect(authDataStorage.getAuthData()).toEqual(authData);

                spyOn(localStorageServiceMock, 'remove').andCallThrough();

                authDataStorage.removeAuthData();
                expect(authDataStorage.getAuthData()).toBeUndefined();
                expect(localStorageServiceMock.remove).toHaveBeenCalledWith('authData');

            });

        });
    });
}