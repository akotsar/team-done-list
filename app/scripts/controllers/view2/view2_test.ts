/// <reference path="../../_app_test.ts" />
/// <reference path="view2.ts" />

module MyApp.View2.Test {
    describe('myApp.view2 module', () => {

        beforeEach(module('myApp.view2'));

        describe('view2 controller', () => {
            var $scope: ng.IScope;

            beforeEach(inject(($rootScope: ng.IScope) => {
                $scope = $rootScope.$new();
            }));

            it('should ....', inject(($controller: ng.IControllerService) => {
                //spec body
                var view2Ctrl: View2Ctrl = $controller(View2.View2Ctrl, { $scope: $scope });
                expect(view2Ctrl).toBeDefined();
            }));

        });
    });
}