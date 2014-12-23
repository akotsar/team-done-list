/// <reference path="../../_app_test.ts" />
/// <reference path="version-directive.ts"/>

module WhoDidWhat.Version.Directive.Test {
    describe('whoDidWhat.version module', () => {
        beforeEach(module('whoDidWhat.version'));

        describe('app-version directive', () => {
            it('should print current version', () => {
                module(($provide: ng.auto.IProvideService) => {
                    $provide.value('version', 'TEST_VER');
                });
                inject(($compile: ng.ICompileService, $rootScope: ng.IScope) => {
                    var element = $compile('<span app-version></span>')($rootScope);
                    expect(element.text()).toEqual('TEST_VER');
                });
            });
        });
    });
}