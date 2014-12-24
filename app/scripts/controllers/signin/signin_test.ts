/// <reference path="../../_app_test.ts" />
/// <reference path="signin.ts" />

module WhoDidWhat.SignIn.Test {
    describe('whoDidWhat.signin module', () => {

        beforeEach(module('whoDidWhat.signin'));

        describe('Signin controller', () => {
            var $scope: SignIn.ISignInCtrlScope,
                ctrl: SignIn.SignInCtrl,
                authServiceMock: Auth.AuthService,
                authDefer: ng.IDeferred<Auth.IUser>;

            beforeEach(inject(($rootScope: ng.IScope, $controller: ng.IControllerService, $q: ng.IQService) => {
                $scope = <ISignInCtrlScope>$rootScope.$new();
                authServiceMock = <Auth.AuthService>{
                    authenticate(username: string, password: string): ng.IPromise<Auth.IUser> {
                        authDefer = $q.defer();
                        return authDefer.promise;
                    }
                };

                ctrl = $controller('SignInCtrl', { $scope: $scope, authService: authServiceMock });
            }));

            describe('signIn()', () => {

                it('should send authenticate requests', () => {
                    spyOn(authServiceMock, 'authenticate').andCallThrough();

                    $scope.email = 'email_data';
                    $scope.password = 'password_data';
                    $scope.signIn();

                    expect(authServiceMock.authenticate).toHaveBeenCalledWith('email_data', 'password_data');
                });

                it('should redirect to /account upon successful authentication', inject(($state: ng.ui.IStateService) => {
                    spyOn($state, 'go');

                    $scope.signIn();

                    authDefer.resolve();
                    $scope.$digest();

                    expect($state.go).toHaveBeenCalledWith('account');
                }));

                it('should display progress while authenticating', inject(() => {
                    expect($scope.progress).not.toBeTruthy();
                    $scope.signIn();
                    expect($scope.progress).toBeTruthy();

                    authDefer.reject();
                    $scope.$digest();

                    expect($scope.progress).not.toBeTruthy();
                }));

                it('should display error message upon authentication failure', inject(($mdToast: any) => {
                    spyOn($mdToast, 'show');

                    $scope.signIn();

                    authDefer.reject();
                    $scope.$digest();

                    expect($mdToast.show).toHaveBeenCalled();
                }));

            });

        });
    });
}