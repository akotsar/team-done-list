/// <reference path="../../_app_test.ts" />
/// <reference path="interpolate-filter.ts"/>

module WhoDidWhat.Version.InterpolateFilter.Test {
    describe('whoDidWhat.version module', () => {
        beforeEach(() => {
            module('whoDidWhat.version');
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
