module TeamDoneList.Version.InterpolateFilter {
    angular.module('teamDoneList.version.interpolate-filter', [])
        .filter('interpolate', [
            'version', (version: string) => {
                return (text: string) => {
                    return text.replace(/\%VERSION\%/mg, version);
                };
            }
        ]);
}