/// <reference path="../../_app_test.ts" />
/// <reference path="signin.ts" />

module TeamDoneList.SignIn.Test {
    describe('teamDoneList.signin module', () => {

        beforeEach(module('teamDoneList.signin'));

        describe('Signin controller', () => {
            var $scope: SignIn.ISignInCtrlScope,
                ctrl: SignIn.SignInCtrl,
                authServiceMock: Auth.AuthService;

            beforeEach(inject(($rootScope: ng.IScope, $controller: ng.IControllerService, $q: ng.IQService) => {
                $scope = $rootScope.$new();
                authServiceMock = <Auth.AuthService>{
                    authenticate(username: string, password: string): ng.IPromise<any> {
                        return $q.defer().promise;
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

                it('should redirect to /home upon successful authentication', inject(($state: ng.ui.IStateService, $q: ng.IQService) => {
                    var authDefer: ng.IDeferred<Auth.IUser>;

                    spyOn($state, 'go');
                    spyOn(authServiceMock, 'authenticate').andCallFake(() => {
                        authDefer = $q.defer();
                        return authDefer.promise;
                    });

                    $scope.signIn();

                    authDefer.resolve();
                    $scope.$digest();

                    expect($state.go).toHaveBeenCalledWith('home');
                }));

            });

        });
    });
}