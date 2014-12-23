/// <reference path="../../_app.ts"/>

module TeamDoneList.Auth.Storage {
    /**
     * Defines properties returned by the authentication service.
     */
    export interface IAuthData {
        /**
         * The authorization token.
         */
        access_token?: string;

        /**
         * The refresh token for updating the session.
         */
        refresh_token?: string;

        /**
         * Name of the user.
         */
        name?: string;
    }

    /**
     * Provides storage for the current authentication data.
     */
    export class AuthDataStorage {
        public static $inject: string[] = ['localStorageService', '$rootScope'];

        constructor(
            private localStorageService: ng.local.storage.ILocalStorageService, 
            private $rootScope: IRootScopeWithAuthData) {
        }

        /**
         * Retrieves the current authentication data.
         */
        public getAuthData(): IAuthData {
            var authData: any = this.localStorageService.get('authData');
            if (angular.isString(authData)) authData = JSON.parse(authData);

            return <IAuthData>(authData);
        }

        /**
         * Stores the provided authentication data.
         * 
         * @param data The authentication data to store.
         */
        public setAuthData(data: IAuthData): void {
            this.localStorageService.set('authData', JSON.stringify(data));
        }

        /**
         * Removes the stored authentication data.
         */
        public removeAuthData(): void {
            this.localStorageService.remove('authData');
        }
    }

    angular.module('teamDoneList.auth.storage', ['LocalStorageModule'])
        .service('authDataStorage', AuthDataStorage);
}