/// <reference path="version.ts"/>

module TeamDoneList.Version.Test {
    describe('teamDoneList.version module', () => {
        beforeEach(module('teamDoneList.version'));

        describe('version service', () => {
            it('should return current version', inject((version: string) => {
                expect(version).toEqual('0.1');
            }));
        });
    });
}
