/// <reference path="auth-data-storage.ts"/>

module TeamDoneList.Auth {
    /**
     * Represents the current user.
     */
    export interface IUser {
        name?: string;
        isAuthenticated?: boolean;
    }

    /**
     * Defines additional properties for the root scope of the app.
     */
    export interface IRootScopeWithAuthData extends ng.IScope {
        user?: IUser;
    }

    /**
     * A service class that provides various authentication-related methods.
     */
    export class AuthService {
        // Specifies the URL for the token authentication.
        private static tokenUrl: string = '/api/auth/token';

        // Defines all auth service events.
        public static Events = {
            AccessDenied: 'auth:access-denied',
            SignedIn: 'auth:signed-in',
            SignedOut: 'auth:signed-out'
        }

        public static $inject: string[] = [
            '$http',
            '$q',
            '$rootScope',
            'authDataStorage'];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $rootScope: IRootScopeWithAuthData,
            private authDataStorage: Storage.AuthDataStorage) {

            // Setting the user info upon start.
            this.updateUserInfo();

            // Handling all state changes and making sure all states that require
            // authentication are only accessible for authenticated users.
            $rootScope.$on('$stateChangeStart', (event: ng.IAngularEvent, toState: ng.ui.IState) => {
                if ((!toState.data || !toState.data.allow_anonymous) && !authDataStorage.getAuthData()) {
                    $rootScope.$emit(AuthService.Events.AccessDenied);
                    event.preventDefault();
                }
            });

            // Handling the access-denied event to clear authentication data and update root scope.
            $rootScope.$on(AuthService.Events.AccessDenied, () => {
                authDataStorage.removeAuthData();
                this.updateUserInfo();
            });
        }

        /**
         * Authenticates the user with given username and password.
         * Returns a promise that returns authenticated user.
         * 
         * @param email Email address of the user to be signed in.
         * @param password The user's password.
         */
        public authenticate(email: string, password: string): ng.IPromise<IUser> {
            var def: ng.IDeferred<IUser> = this.$q.defer();
                
            // Preparing the request string.
            // NOTE: We have to manually prepare the request string because
            // the authentication service accepts only x-www-form-urlencoded requests,
            // but angular can't encode them and jQuery's param() method is also not available.
            var request: string = 'grant_type=password'
                + '&username=' + encodeURIComponent(email)
                + '&password=' + encodeURIComponent(password);

            this.$http.post(AuthService.tokenUrl, request, { headers: { 'Content-Type': 'x-www-form-urlencoded' } })
                .then((resp: ng.IHttpPromiseCallbackArg<Storage.IAuthData>) => {
                    // Storing the token in local storage for future use.
                    this.authDataStorage.setAuthData(resp.data);
                    this.updateUserInfo(resp.data);

                    this.$rootScope.$emit(AuthService.Events.SignedIn);

                    def.resolve(this.getUser(resp.data));
                })
                .catch((resp: any) => {
                    // Notifying that the authentication was unsuccessful and signing out the user.
                    this.$rootScope.$emit(AuthService.Events.AccessDenied);

                    def.reject(resp && resp.data);
                });

            return def.promise;
        }

        /**
         * Signs the user out.
         */
        public signOut(): void {
            this.authDataStorage.removeAuthData();
            this.updateUserInfo();

            this.$rootScope.$emit(AuthService.Events.SignedOut);
        }

        /**
         * Updates the current user information in the root scope.
         */
        public updateUserInfo(authData?: Storage.IAuthData): void {
            authData = authData || this.authDataStorage.getAuthData();

            angular.extend(
                this.$rootScope.user || (this.$rootScope.user = {}),
                this.getUser(authData));
        }

        /**
         * Constructs a user instance from the supplied auth data.
         * 
         * @param authData The auth data to construct user from.
         */
        private getUser(authData: Storage.IAuthData): IUser {
            return {
                isAuthenticated: !!authData,
                name: authData ? authData.name : null
            };
        }
    }

    // Registering the auth module in angular and configuring http interceptors.
    angular.module('teamDoneList.auth', [
            'ui.router',
            'teamDoneList.auth.storage'
        ])
        .service('authService', AuthService)
        .config([
            '$httpProvider',
            ($httpProvider: ng.IHttpProvider) => {
                // Registering an interceptor that will make sure the Authorization header is
                // properly added to the requests.
                $httpProvider.interceptors.push([
                    'authDataStorage',
                    '$q',
                    '$rootScope',
                    (authDataStorage: Storage.AuthDataStorage, $q: ng.IQService, $rootScope: ng.IScope) => {
                        return {
                            'request'(config: ng.IRequestConfig) {
                                var authData = authDataStorage.getAuthData(),
                                    token = authData && authData.access_token;

                                if (token) {
                                    config.headers['Authorization'] = 'Bearer ' + token;
                                }

                                return config;
                            },

                            'responseError'(resp: any) {
                                if (resp.status === 401) {
                                    $rootScope.$emit(AuthService.Events.AccessDenied);
                                }

                                return $q.reject(resp);
                            }
                        }
                    }
                ]);
            }
        ]);
}