//----------------------------------------------------------
//----Description: Ici nous retrouvons les routes qu'utilise
//----Angular mais aussi des factories et un controller.
//----Fait par : Maxime Savard et Keven Maltais
//----Le: 2018-02-26
//----Révisé le:___________
//----------------------------------------------------------
var myApp = angular.module('myApp', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'ngCookies', 'ngMaterial', 'ui.calendar', 'ui.mask', 'angular-confirm', '720kb.tooltips']);

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, accessFac) {
    $routeProvider
    .when('/Menu', {
        templateUrl: 'Views/Menu.html',
        controller: 'menuCtrl',
        resolve: {
            "check": function (accessFac, $location) {
                if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
                    $location.path('/Menu');
                } else {
                    $location.path('/');				//redirect user to home if it does not have permission.
                    alert("Accès Interdit. Vous devez vous identifier");
                }
            }
        }
    })
    .when('/', {
        templateUrl: 'Views/Login.html',
        controller: 'loginCtrl',
        resolve: {
            "check": function (accessFac, $location) {
                if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
                    $location.path('/Menu');
                } else {
                    $location.path('/Login');				//redirect user to home if it does not have permission.
                }
            }
        }
    })
    .when('/Login', {
        templateUrl: 'Views/Login.html',
        controller: 'loginCtrl'
    })
    .when('/Quitter', {
        templateUrl: 'Views/Login.html',
        controller: 'loginCtrl'
    })
        .when('/RechercheClients', {
            templateUrl: 'Views/RechercheClients.html',
            controller: 'rechercheClientsCtrl'
        })
         .when('/RechercheRDV', {
             templateUrl: 'Views/RechercheRDV.html',
             controller: 'rechercheRDVCtrl'
         })
         .when('/RechercheAnimaux', {
             templateUrl: 'Views/RechercheAnimaux.html',
             controller: 'rechercheAnimauxCtrl'
         })
        .when('/FicheAnimaux', {
            templateUrl: 'Views/FicheAnimaux.html',
            controller: 'ficheAnimauxCtrl'
        })
        .when('/FicheClients', {
            templateUrl: 'Views/FicheClients.html',
            controller: 'ficheClientCtrl'
        })
        .when('/Calendrier', {
            templateUrl: 'Views/Calendrier.html',
            controller: 'calendrierCtrl'
        })
        .when('/ParametreGeneraux', {
            templateUrl: 'Views/ParametreGeneraux.html',
            controller: 'ParametreGenerauxCtrl'
        })
         .when('/GestionRDV', {
             templateUrl: 'Views/GestionRDV.html',
             controller: 'rdvCtrl'
         })
         .when('/ListeAttente', {
             templateUrl: 'Views/ListeAttente.html',
             controller: 'ListeAttenteCtrl'
         })
         .when('/Anniversaire', {
             templateUrl: 'Views/Anniversaire.html',
             controller: 'AnniversaireCtrl'
         })
         .when('/RaportPourImpression', {
             templateUrl: 'Views/RaportPourImpression.html',
             controller: 'ficheClientCtrl'
         })
    .otherwise({
        redirectTo: '/Login'
    });

    $locationProvider.html5Mode({ enabled: true });
}])


myApp.factory('accessFac', function ($rootScope, $cookies) {
    var obj = {}
    this.access = false;
    obj.getPermission = function () {
        this.access = true;
    }
    obj.checkPermission = function () {
        if ($cookies.getObject('user')) {
            return true;
        } else {
            return false;
        }
    }
    return obj;
});

myApp.factory('printer', ['$rootScope', '$compile', '$http', '$timeout', '$q',
    function ($rootScope, $compile, $http, $timeout, $q) {
        var printHtml = function (html) {
            var deferred = $q.defer();
            var hiddenFrame = $('<iframe style="visibility: hidden"></iframe>').appendTo('body')[0];
            hiddenFrame.contentWindow.printAndRemove = function () {
                hiddenFrame.contentWindow.print();
                $(hiddenFrame).remove();
                deferred.resolve();
            };
            var htmlContent = "<!doctype html>" +
                "<html>" +
                '<body onload="printAndRemove();">' +
                html +
                '</body>' +
                "</html>";
            var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
            doc.write(htmlContent);
            doc.close();
            return deferred.promise;
        };

        var openNewWindow = function (html) {
            var newWindow = window.open("printTest.html");
            newWindow.addEventListener('load', function () {
                $(newWindow.document.body).html(html);
            }, false);
        };

        var print = function (templateUrl, data) {
            $rootScope.isBeingPrinted = true;
            $http.get(templateUrl).then(function (templateData) {
                var template = templateData.data;
                var printScope = $rootScope.$new();
                angular.extend(printScope, data);
                var element = $compile($('<div>' + template + '</div>'))(printScope);
                var renderAndPrintPromise = $q.defer();
                var waitForRenderAndPrint = function () {
                    if (printScope.$$phase || $http.pendingRequests.length) {
                        $timeout(waitForRenderAndPrint, 1000);
                    } else {
                        // Replace printHtml with openNewWindow for debugging
                        printHtml(element.html()).then(function () {
                            $rootScope.isBeingPrinted = false;
                            renderAndPrintPromise.resolve();
                        });
                        printScope.$destroy();
                    }
                    return renderAndPrintPromise.promise;
                };
                waitForRenderAndPrint();
            });
        };

        var printFromScope = function (templateUrl, scope, afterPrint) {
            $rootScope.isBeingPrinted = true;
            $http.get(templateUrl).then(function (response) {
                var template = response.data;
                var printScope = scope;
                var element = $compile($('<div>' + template + '</div>'))(printScope);
                var renderAndPrintPromise = $q.defer();
                var waitForRenderAndPrint = function () {
                    if (printScope.$$phase || $http.pendingRequests.length) {
                        $timeout(waitForRenderAndPrint);
                    } else {
                        printHtml(element.html()).then(function () {
                            $rootScope.isBeingPrinted = false;
                            if (afterPrint) {
                                afterPrint();
                            }
                            renderAndPrintPromise.resolve();
                        });
                    }
                    return renderAndPrintPromise.promise;
                };
                waitForRenderAndPrint();
            });
        };
        return {
            print: print,
            printFromScope: printFromScope
        };
    }]);


//Initialisation du controller login
myApp.controller('loginCtrl', ['$scope', '$http', '$location', '$rootScope', 'accessFac', '$cookies', function ($scope, $http, $location, $rootScope, accessFac, $cookies) {

    if ($cookies.putObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };
    $scope.getAccess = function () {
        accessFac.getPermission();
    }

    //Initialisation au départ
    $cookies.putObject('user', false);
    $scope.User = '';
    $scope.Password = '';

    //Appel de la fonction pour récupérer les clients
    function checkLogin() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=Login',
            data: {
                User: $scope.User, Pass: $scope.Password
            }
        }).then(function (reponse) {
            if (reponse.data == "true") {
                $cookies.putObject('user', true);
                $rootScope.IsConnected = true;
                getSauvegarde();
                $location.path('/Menu');
            } else if (reponse.data == "false") {
                $rootScope.IsConnected = false;
                $cookies.putObject('user', false);
            }
        }, function (reponse) {
        });
    }


    //Appel de la fonction pour récupérer les parametre de sauvegarde
    function getSauvegarde() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetSetting',
            params: { Action: 'GetSetting' },
        }).then(function (reponse) {
            $scope.sauvegarde = reponse.data;
            $scope.verifierSauvegarde();
        }, function (reponse) {
        });
    };

    $scope.verifierSauvegarde = function () {
        var d = new Date()
        var curr_day = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        var curr_year = d.getFullYear();
        $scope.datecourante = new Date((curr_year + "-" + curr_month + "-" + curr_day));
        $scope.DateSauvegardeTemp = new Date(($scope.sauvegarde.DateSauvegarde));
        $scope.date = curr_year + "-" + curr_month + "-" + curr_day;
        if ($scope.sauvegarde.Frequence == 0) {
            if ($scope.DateSauvegardeTemp < $scope.datecourante) {
                save(d.getDate() + 1, d.getMonth())
            }
        } else if ($scope.sauvegarde.Frequence == 1) {
            if ($scope.sauvegarde.DateSauvegarde < $scope.datecourante) {
                save(d.getDate() + 7, d.getMonth())
            }
        } else {
            if ($scope.sauvegarde.DateSauvegarde < $scope.datecourante) {
                save(d.getDate(), d.getMonth() + 1)
            }
        }
    }
    //Effectue la sauvegarde
    function save(addDay, addMonth) {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostSave'
        }).then(function (reponse) {
        }, function (reponse) {
        });
        var d = new Date();
        var curr_day = addDay;
        var curr_month = addMonth;
        curr_month++;
        var curr_year = d.getFullYear();
        $scope.date = curr_year + "-" + curr_month + "-" + curr_day;
        $scope.sauvegarde.DateSauvegarde = $scope.date
        PutSetting();
    }

    //Appel de la fonction pour enregistrer les données d'entreprise
    function PutSetting() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutSetting',
            data: {
                sauvegarde: angular.copy($scope.sauvegarde)
            }
        }).then(function (reponse) {
        }, function (reponse) {
        });
    };



    //fonction pour verifier le login et password
    $scope.checkAuthentification = function () {
        checkLogin()
    }
    //Fonction pour effectuer une sauvegarde
    $scope.SendEmail = function () {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=SendEmail'
        }).then(function (reponse) {
        }, function (reponse) {
        });

    };
}])

myApp.run(['$rootScope', '$cookies', '$http', '$location', function ($rootScope, $cookies, $http, $location) {
    $rootScope.globals = {};

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.globals = $cookies.getObject('user') || {};
        if ($rootScope.globals != true) {
            $location.path('Login');
            console.log('test');
        }
    });
}]);
