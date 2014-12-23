/// <reference path="../../_app.ts" />

module WhoDidWhat.Account {
    /**
     * Defines the scope interface of the account controller.
     */
    export interface IAccountCtrlScope extends ng.IScope {
        /**
         * The greeting message.
         */
        greeting?: string;

        /**
         * Signs the current user out.
         */
        signOut(): void;
    }

    /**
     * The account page controller.
     */
    export class AccountCtrl {
        public static $inject = [
            '$scope',
            '$http',
            'authService'
        ];

        constructor(
            private $scope: IAccountCtrlScope,
            private $http: ng.IHttpService,
            private authService: Auth.AuthService) {
            $http.get<any>('/api/account').success((resp) => {
                $scope.greeting = resp.greeting;
            });

            $scope.signOut = <() => void>angular.bind(this, this.signOut);
        }

        /**
         * Signs the current user out.
         */
        public signOut() {
            this.authService.signOut();
        }
    }

    angular.module('whoDidWhat.account', [
            'whoDidWhat.auth'
        ])
        .controller('AccountCtrl', AccountCtrl);
}