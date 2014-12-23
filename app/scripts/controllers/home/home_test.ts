/// <reference path="../../_app_test.ts" />
/// <reference path="home.ts" />

module TeamDoneList.Home.Test {
    describe('teamDoneList.home module', () => {

        beforeEach(module('teamDoneList.home'));

        describe('home controller', () => {
            var $scope: Home.IHomeCtrlScope,
                createController: () => Home.HomeCtrl;

            beforeEach(inject(($rootScope: ng.IScope, $controller: ng.IControllerService) => {
                $scope = $rootScope.$new();
                createController = () => {
                    return $controller('HomeCtrl', { $scope: $scope });
                }
            }));

            it('should request greeting message', inject(($httpBackend: ng.IHttpBackendService) => {
                $httpBackend.expectGET('/api/account').respond({
                    greeting: 'Hello Test!'
                });

                var homectrl: Home.HomeCtrl = createController();

                expect($scope.greeting).toBeUndefined();

                $httpBackend.flush();

                expect($scope.greeting).toEqual('Hello Test!');
            }));

        });
    });
}