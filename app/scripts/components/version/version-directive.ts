module WhoDidWhat.Version.Directive {
    angular.module('whoDidWhat.version.version-directive', [])
        .directive('appVersion', [
            'version', (version: string) => {
                return (scope: ng.IScope, elm: JQuery, attrs: any) => {
                    elm.text(version);
                };
            }
        ]);
}