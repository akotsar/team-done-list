module MyApp.Version {
    angular.module('myApp.version', [
        'myApp.version.version-directive',
        'myApp.version.interpolate-filter'
    ])
        .value('version', '0.1');
}