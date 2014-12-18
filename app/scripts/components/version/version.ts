module TeamDoneList.Version {
    angular.module('teamDoneList.version', [
        'teamDoneList.version.version-directive',
        'teamDoneList.version.interpolate-filter'
    ])
        .value('version', '0.1');
}