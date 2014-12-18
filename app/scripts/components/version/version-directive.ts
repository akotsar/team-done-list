module TeamDoneList.Version.Directive {
    angular.module('teamDoneList.version.version-directive', [])
        .directive('appVersion', [
            'version', (version: string) => {
                return (scope: ng.IScope, elm: JQuery, attrs: any) => {
                    elm.text(version);
                };
            }
        ]);
}