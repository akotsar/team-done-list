/// <reference path="../../_app_test.ts" />
/// <reference path="auth-service.ts" />

module WhoDidWhat.Auth.Test {
    describe('whoDidWhat.auth module', () => {

        beforeEach(module('whoDidWhat.auth'));

        describe('AuthService', () => {
            // Declaring variables and preparing mocks.
            var authService: AuthService,
                $httpBackend: ng.IHttpBackendService,
                $rootScope: IRootScopeWithAuthData,
                authData = {
                    access_token: 'test_token',
                    name: 'Test User'
                };

            // Defining the data storage mock.
            var authDataStorageMock: Storage.AuthDataStorage = <Storage.AuthDataStorage>{
                    getAuthData(): Storage.IAuthData {
                        return undefined;
                    },
                    setAuthData(data: Storage.IAuthData): void {
                    },
                    removeAuthData(): void {
                    }
                };

            beforeEach(inject((
                    _$httpBackend_: ng.IHttpBackendService,
                    _$rootScope_: IRootScopeWithAuthData,
                    $injector: ng.auto.IInjectorService
                ) => {
                $httpBackend = _$httpBackend_;
                $httpBackend.resetExpectations();
                $rootScope = _$rootScope_;
                authService = $injector.instantiate(AuthService, {
                    authDataStorage: authDataStorageMock
                });
            }));

            it('should define "user" in root scope', () => {
                expect($rootScope.user).not.toBeUndefined();
            });

            describe('authenticate()', () => {
                it('should send authentication request to the server', () => {
                    $httpBackend.expectPOST(
                            '/api/auth/token',
                            'grant_type=password&username=username_data&password=password_data')
                        .respond(authData);

                    authService.authenticate('username_data', 'password_data');

                    $httpBackend.flush();
                });

                it('should return authenticated user upon successful authentication', () =>
                {
                    $httpBackend.whenPOST('/api/auth/token').respond(authData);

                    var user;
                    authService.authenticate('username_data', 'password_data')
                        .then(data => user = data);

                    $httpBackend.flush();

                    expect(user).toEqual({
                        name: authData.name,
                        isAuthenticated: true
                    });
                });

                it('should store authentication data upon successful authentication', () => {
                    $httpBackend.whenPOST('/api/auth/token').respond(authData);
                    spyOn(authDataStorageMock, 'setAuthData').andCallThrough();

                    authService.authenticate('username_data', 'password_data');
                    $httpBackend.flush();

                    expect(authDataStorageMock.setAuthData).toHaveBeenCalledWith(authData);
                    expect($rootScope.user).toMatch({
                        isAuthenticated: true,
                        name: authData.name
                    });
                });

                it('should emit access-denied event and remove auth data after unsuccessful authentication', inject(() => {
                    $httpBackend.whenPOST('/api/auth/token').respond(404);
                    spyOn($rootScope, '$emit');
                    spyOn(authDataStorageMock, 'removeAuthData');

                    var rejected: boolean = false;
                    authService.authenticate('username_data', 'password_data')
                        .catch(() => rejected = true);
                    $httpBackend.flush();

                    expect($rootScope.$emit).toHaveBeenCalledWith('auth:access-denied');
                    expect(rejected).toBeTruthy();
                }));
            });

            describe('signOut()', () => {
                it('should sign the user out, remove auth data and emit event', inject(() => {
                    spyOn(authDataStorageMock, 'removeAuthData');
                    spyOn($rootScope, '$emit');

                    authService.signOut();

                    expect(authDataStorageMock.removeAuthData).toHaveBeenCalled();
                    expect($rootScope.user.isAuthenticated).not.toBeTruthy();
                    expect($rootScope.$emit).toHaveBeenCalledWith('auth:signed-out');
                }));
            });

            it('should sign the user out on access-denied event', inject(() => {
                $rootScope.user.isAuthenticated = true;
                spyOn(authDataStorageMock, 'removeAuthData');

                $rootScope.$emit('auth:access-denied');

                expect($rootScope.user.isAuthenticated).not.toBeTruthy();
                expect(authDataStorageMock.removeAuthData).toHaveBeenCalled();
            }));

            it('should prevent anonymous user from accessing restricted states', inject(() => {
                spyOn($rootScope, '$emit').andCallThrough();
                $rootScope.$emit('$stateChangeStart', {});
                expect($rootScope.$emit).toHaveBeenCalledWith('auth:access-denied');

                (<any>$rootScope.$emit).reset();

                $rootScope.$emit('$stateChangeStart', {
                    data: {
                        allow_anonymous: true
                    }
                });
                expect($rootScope.$emit).not.toHaveBeenCalledWith('auth:access-denied');
            }));

            it('should allow anonymous user access non-restricted states', inject(() => {
                spyOn($rootScope, '$emit').andCallThrough();
                $rootScope.$emit('$stateChangeStart', {
                    data: {
                        allow_anonymous: true
                    }
                });
                expect($rootScope.$emit).not.toHaveBeenCalledWith('auth:access-denied');
            }));

            it('should allow authenticated users access restricted states', inject(() => {
                spyOn($rootScope, '$emit').andCallThrough();
                spyOn(authDataStorageMock, 'getAuthData').andCallFake(() => {
                    return {};
                });

                $rootScope.$emit('$stateChangeStart', {});
                expect($rootScope.$emit).not.toHaveBeenCalledWith('auth:access-denied');
            }));

            it('should add Authorization header to all http requests', inject(($http: ng.IHttpService, $httpBackend: ng.IHttpBackendService, authDataStorage: Storage.AuthDataStorage) => {
                $httpBackend.expectGET('/api/test', {
                    Accept: 'application/json, text/plain, */*',
                    Authorization: 'Bearer ' + authData.access_token
                }).respond('');

                spyOn(authDataStorage, 'getAuthData').andCallFake(() => authData);

                $http.get('/api/test');

                $httpBackend.flush();
            }));

            it('should emit access-denied awhen http request fails authorization', inject((
                    $http: ng.IHttpService,
                    $httpBackend: ng.IHttpBackendService,
                    authDataStorage: Storage.AuthDataStorage,
                    $rootScope: ng.IScope) => {

                $httpBackend.expectGET('/api/test').respond(401);
                spyOn($rootScope, '$emit');

                $http.get('/api/test');

                $httpBackend.flush();

                expect($rootScope.$emit).toHaveBeenCalledWith('auth:access-denied');
            }));

        });
    });
}