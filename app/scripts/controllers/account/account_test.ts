/// <reference path="../../_app_test.ts" />
/// <reference path="account.ts" />

module WhoDidWhat.Account.Test {
    describe('whoDidWhat.account module', () => {

        beforeEach(module('whoDidWhat.account'));

        describe('account controller', () => {
            var $scope: Account.IAccountCtrlScope,
                createController: () => Account.AccountCtrl;

            beforeEach(inject(($rootScope: ng.IScope, $controller: ng.IControllerService) => {
                $scope = <IAccountCtrlScope>$rootScope.$new();
                createController = () => {
                    return $controller('AccountCtrl', { $scope: $scope });
                }
            }));

            it('should request greeting message', inject(($httpBackend: ng.IHttpBackendService) => {
                $httpBackend.expectGET('/api/account').respond({
                    greeting: 'Hello Test!'
                });

                var ctrl: Account.AccountCtrl = createController();

                expect($scope.greeting).toBeUndefined();

                $httpBackend.flush();

                expect($scope.greeting).toEqual('Hello Test!');
            }));

            describe('signOut()', () => {
                it('should sign the user out', inject((authService: Auth.AuthService) => {
                    spyOn(authService, 'signOut');

                    createController();
                    $scope.signOut();

                    expect(authService.signOut).toHaveBeenCalled();
                }));
            });

        });
    });
}