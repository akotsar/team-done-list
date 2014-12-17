module MyApp.Version.InterpolateFilter {
    angular.module('myApp.version.interpolate-filter', [])
        .filter('interpolate', [
            'version', (version: string) => {
                return (text: string) => {
                    return text.replace(/\%VERSION\%/mg, version);
                };
            }
        ]);
}