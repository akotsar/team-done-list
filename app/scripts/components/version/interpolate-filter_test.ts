/// <reference path="../../_app_test.ts" />
/// <reference path="interpolate-filter.ts"/>

module MyApp.Version.InterpolateFilter.Test {
    describe('myApp.version module', () => {
        beforeEach(() => {
            module('myApp.version');
        });

        describe('interpolate filter', () => {
            beforeEach(module(($provide: ng.auto.IProvideService) => {
                $provide.value('version', 'TEST_VER');
            }));

            it('should replace VERSION', inject((interpolateFilter: Function) => {
                expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
            }));
        });
    });
}
