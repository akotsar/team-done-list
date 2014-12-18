/// <reference path="../../_app_test.ts" />
/// <reference path="view1.ts" />

module MyApp.View1.Test {
    describe('myApp.view1 module', () => {

        beforeEach(module('myApp.view1'));

        describe('view1 controller', () => {
            var $scope: View1.IView1CtrlScope;

            beforeEach(inject(($rootScope: ng.IScope) => {
                $scope = $rootScope.$new();
            }));

            it('should have greeting message', inject(($controller: ng.IControllerService) => {
                var view1Ctrl: View1Ctrl = $controller("View1Ctrl", { $scope: $scope });
                expect(view1Ctrl.$scope.greeting).toEqual(jasmine.any(String));
            }));

        });
    });
}