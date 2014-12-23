module WhoDidWhat.Version {
    angular.module('whoDidWhat.version', [
        'whoDidWhat.version.version-directive',
        'whoDidWhat.version.interpolate-filter'
    ])
        .value('version', '0.1');
}