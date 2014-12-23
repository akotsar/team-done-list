/// <reference path="version.ts"/>

module WhoDidWhat.Version.Test {
    describe('whoDidWhat.version module', () => {
        beforeEach(module('whoDidWhat.version'));

        describe('version service', () => {
            it('should return current version', inject((version: string) => {
                expect(version).toEqual('0.1');
            }));
        });
    });
}
