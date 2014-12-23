/// <reference path="../../_app.ts"/>
/// <reference path="../../components/auth/auth-service.ts"/>

module TeamDoneList.SignIn {
    /**
     * Defines the Sign In controller scope interface
     */
    export interface ISignInCtrlScope extends ng.IScope {
        /**
         * Signs the user in.
         */
        signIn? (): void;

        /**
         * The entered email address.
         */
        email?: string;

        /**
         * The entered password.
         */
        password?: string;
    }

    /**
     * The Sign In page controller.
     */
    export class SignInCtrl {
        public static $inject = [
            '$scope',
            'authService',
            '$state'
        ];

        constructor($scope: ISignInCtrlScope, authService: Auth.AuthService, $state: ng.ui.IStateService) {
            $scope.signIn = () => {
                authService.authenticate($scope.email, $scope.password)
                    .then(() => {
                        $state.go('home');
                    })
                    .catch((resp: any) => {
                        if (resp && resp.data && resp.data.modelState) {
                            alert(resp.data.modelState['']);
                        }
                    });
            }
        }
    }

    angular.module('teamDoneList.signin', [
            'ui.router',
            'teamDoneList.auth'
        ])
        .controller('SignInCtrl', SignInCtrl);
}