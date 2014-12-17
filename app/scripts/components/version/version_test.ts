/// <reference path="version.ts"/>

module MyApp.Version.Test {
    describe('myApp.version module', () => {
        beforeEach(module('myApp.version'));

        describe('version service', () => {
            it('should return current version', inject((version: string) => {
                expect(version).toEqual('0.1');
            }));
        });
    });
}
