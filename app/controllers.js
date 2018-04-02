//---------------------------------------------------------
//----Description: Ici nous retrouvons tous les controleurs
//----sauf un qui se trouve dans le fichier app.js.
//----Fait par : Maxime Savard et Keven Maltais
//----Le: 2018-02-26
//----Révisé le:___________
//---------------------------------------------------------

//--------------------------------------
//Controller Menu
//--------------------------------------
myApp.controller('menuCtrl', ['$scope', '$http', '$location', '$rootScope', '$cookies', 'printer', function ($scope, $http, $location, $rootScope, $cookies, printer) {

    $scope.del_cookie = function () {
        $cookies.remove("user");
    };

    getClients();
    getAnimaux();
    getRDV();
    getAnniversaireAnimaux();
    getSetting();


    //Appel de la fonction pour récupérer les clients
    function getClients() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetClients' }
        }).then(function (reponse) {
            $scope.allClients = reponse.data;
            $scope.nbrClient = reponse.data.length;
            getAttente();
        }, function (reponse) {
        });
    }


    //Appel de la fonction pour récupérer les Animaux
    function getAnimaux() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetAnimaux' }
        }).then(function (reponse) {
            $scope.nbrAnimaux = reponse.data.length;
        }, function (reponse) {
        });
    }


    //Appel de la fonction pour récupérer les RDV
    function getRDV() {
        $scope.frequence = "Futur";
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetRDV', Frequence: $scope.frequence }
        }).then(function (reponse) {
            $scope.listeRdv = reponse.data;
            semaineCourante();
        }, function (reponse) {
        });
    }


    //Appel de la fonction pour récupérer les Animaux
    function getAnniversaireAnimaux() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetAnniversaireAnimaux',
            params: { Action: 'GetAnniversaireAnimaux', Frequence: 7 },
        }).then(function (reponse) {
            $scope.nbrFete = reponse.data.length;
        }, function (reponse) {
        });
    }

    //Permet de retourner les setting
    function getSetting() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetSetting',
            params: { Action: 'GetSetting' },
        }).then(function (reponse) {
            $scope.entreprise = reponse.data;
        });
    };


    //Function pour compter le nombre de client en attente d'un rendez-vous
    function getAttente() {
        $scope.nbrAttente = 0;
        for (var i = 0; i < $scope.allClients.length; i++) {
            if ($scope.allClients[i].En_Attente == 1)
                $scope.nbrAttente++;
        }
    }


    //Fonction pour déterminer la semaine courante
    function semaineCourante() {
        var today = new Date();
        $scope.mondayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
        $scope.sundayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
        d = new Date($scope.listeRdv[0].Date_Rdv);
        GetRdvPourSemaineCourrante();
    }

    //Fonction pour determiner les rendez vous dans la semaine courrante et les affichers sur la tuile du menu
    function GetRdvPourSemaineCourrante() {
        $scope.RdvPourLaSemaine = [];
        for (var i = 0; i < $scope.listeRdv.length; i++) {
            d = new Date($scope.listeRdv[i].Date_Rdv);
            if (d >= $scope.mondayOfWeek && d <= $scope.sundayOfWeek) {
                $scope.RdvPourLaSemaine.push($scope.listeRdv[i]);
            }
        }
        $scope.nbrRdvPourLaSemaine = $scope.RdvPourLaSemaine.length;
    }


    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };

    //Fonction pour effectuer une sauvegarde
    $scope.postSave = function () {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostSave'
        }).then(function (reponse) {
        }, function (reponse) {
        });

    };

    //Fonction qui permet d'imprimmer un rapport d'un feuille vierge a remplir
    $scope.printdiv = function () {
        printer.print("views/Impression.html", null);
    }

}])


//--------------------------------------
//Controller RechercheClient
//--------------------------------------
myApp.controller('rechercheClientsCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', function ($scope, $rootScope, $http, $location, $rootScope, $cookies) {
    //Opération a effectuer au load de la page
    var allClients = [];
    $rootScope.nouveauClient = false;
    $scope.selected = false;
    $scope.selectedRow = null;
    getClients();

    //Delete le cookie
    $scope.del_cookie = function () {
        $cookies.remove("user");
    };
    //Test si l'authentification
    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };

    //Redirection vers la fiche Client vide
    $scope.nouveauFunction = function () {
        $rootScope.nouveauClient = true;
        $location.path('FicheClients');
    }

    //Redirection vers la fiche Client
    $scope.ficheClient = function () {
        $location.path('FicheClients');
    };

    //Désélection d'un client
    $scope.unSelectRow = function () {
        $rootScope.selectedClient = {}
        $scope.selectedRow = null;
        $scope.selected = false;
    }

    //Sélection d'un client dans la liste
    $scope.selectionClient = function (No_Client, index) {
        if ($scope.selectedRow != index || $scope.selectedRow == null) {
            $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
            for (var i = 0; i < $rootScope.listeClients.length; i++) {
                if (No_Client == $rootScope.listeClients[i].No_Client) {
                    $rootScope.selectedClient = $rootScope.listeClients[i];
                    $scope.selected = true;
                }
            }
        } else {
            $scope.unSelectRow();
        }
    }

    //Appel de la fonction pour récupérer les clients
    function getClients() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetClients' }
        }).then(function (reponse) {
            allClients = reponse.data;
            $rootScope.listeClients = reponse.data;
            $scope.totalItems = $rootScope.listeClients.length;
        }, function (reponse) {
        });
    }

    //Permet de gérer le checkbox de la recherche
    $scope.sortEnAttente = function () {
        var clientFiltrer = [];
        if ($scope.sortAttente) {
            for (var i = 0; i < $rootScope.listeClients.length; i++) {
                if ($rootScope.listeClients[i].En_Attente == 1) {
                    clientFiltrer.push($rootScope.listeClients[i]);
                }
            }
        }
        else {
            clientFiltrer = allClients;
        }
        $rootScope.listeClients = clientFiltrer;
    }

    //Système de paging
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
    };
}])

//--------------------------------------
//Controller RechercheRDV
//--------------------------------------
myApp.controller('rechercheRDVCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$mdDialog', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $mdDialog) {
    //Opération a effectuer au load de la page
    var allRdv = [];
    var Service = {};
    $scope.listeRDV = {};
    $scope.listeRDV.Service = [];
    $scope.selected = false;
    $scope.selectedRow = null;
    $scope.frequence = "Futur";
    getRDV();

    //Delete le cookie
    $scope.del_cookie = function () {
        $cookies.remove("user");
    };
    //Test si l'authentification
    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };

    //Redirection vers la fiche Client
    $scope.ficheClient = function () {
        $location.path('FicheClients');
    };

    //Redirection vers la fiche Client
    $scope.ficheAnimaux = function () {
        $location.path('FicheAnimaux');
    };

    //Désélection d'un client
    $scope.unSelectRow = function () {
        $rootScope.selectedRDV = {}
        $scope.selectedRow = null;
        $scope.selected = false;
    }

    //Load un fenêtre modal du rdv sélectionné
    $scope.loadrdvFunction = function (ev, where) {
        $rootScope.loadFrom = where
        $rootScope.NewRdv = false;
        $mdDialog.show({
            controller: 'rdvCtrl',
            templateUrl: 'Views/GestionRDV.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (answer) {
            $scope.status = 'Fenêtre ouverte';
        }, function () {
            $scope.status = 'Fenêtre annuler';
        });
    };

    //Sélection d'un RDV dans la liste
    $scope.selectionRDV = function (No_Rdv, index) {
        if ($scope.selectedRow != index || $scope.selectedRow == null) {
            $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
            for (var i = 0; i < $scope.listeRdv.length; i++) {
                if (No_Rdv == $scope.listeRdv[i].No_Rdv) {
                    $rootScope.selectedRDV = $scope.listeRdv[i];
                    $rootScope.selectedClient = $scope.listeRdv[i];
                    $rootScope.selectedAnimal = $scope.listeRdv[i];
                    $scope.selected = true;
                }
            }
        } else {
            $scope.unSelectRow();
        }
    }

    //Appel de la fonction pour récupérer les clients
    function getRDV() {
        console.log($scope.frequence)
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetRDV', Frequence: $scope.frequence }
        }).then(function (reponse) {
            allRdv = reponse.data;
            $scope.listeRdv = reponse.data;
            $scope.totalItems = $scope.listeRdv.length;
            for (var i = 0; i < reponse.data.length; i++) {
                getServiceRDV($scope.listeRdv[i].No_Rdv, i)
            }
        }, function (reponse) {
        });
    }
    //Fonction pour mettre a jour la liste selon la recherche
    $scope.reloadListe = function () {
        getRDV();
    }

    //Appel de la fonction pour récupérer la les services d'un RDV
    function getServiceRDV(NoRdv, posRdv) {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetServiceRDV',
            params: { Action: 'GetServiceRDV', No_Rdv: NoRdv },
        }).then(function (reponse) {
            $scope.listeRdv[posRdv].Service = []
            for (var i = 0; i < reponse.data.length; i++) {
                Service.No_Service = reponse.data[i].No_Service;
                Service.Nom_Service = reponse.data[i].Nom_Service;
                Service.No_Detail = reponse.data[i].No_Detail;
                Service.Date_Detail = reponse.data[i].Date_Detail;
                $scope.listeRdv[posRdv].Service.push(angular.copy(Service))
            }
        }, function (reponse) {
        });
    };

    //Système de paging
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
    };
}])



//--------------------------------------
//Controller RechercheAnimal
//--------------------------------------
myApp.controller('rechercheAnimauxCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', function ($scope, $rootScope, $http, $location, $rootScope, $cookies) {

    //Delete le cookie
    $scope.del_cookie = function () {
        $cookies.remove("user");
    };
    //Test si l'authentification
    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };


    //Opération a effectuer au load de la page
    $scope.selected = false;
    var allAnimaux = [];
    $scope.selectedRow = null;
    $rootScope.selectedClient = {};
    getAnimaux();


    //Appel de la fonction pour récupérer les Animaux
    function getAnimaux() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetAnimaux' }
        }).then(function (reponse) {
            allAnimaux = reponse.data;
            $scope.listeAnimaux = reponse.data;
            $scope.totalItems = $scope.listeAnimaux.length;
        }, function (reponse) {
        });
    }


    //Recherche selon les filtres
    $scope.sortTypefunc = function () {
        $scope.listeAnimaux = allAnimaux
        var animauxFiltrer = [];
        for (var i = 0; i < $scope.listeAnimaux.length; i++) {
            if ($scope.sortType.type == 'Chien') {
                if ($scope.listeAnimaux[i].Type == 'Chien') {
                    animauxFiltrer.push($scope.listeAnimaux[i]);
                }
            }
            else if ($scope.sortType.type == 'Chat') {
                if ($scope.listeAnimaux[i].Type == 'Chat') {
                    animauxFiltrer.push($scope.listeAnimaux[i]);
                }
            } else {
                animauxFiltrer = allAnimaux;
                break;
            }
        }
        $scope.listeAnimaux = animauxFiltrer;
    }


    //Redirection vers la fiche Client
    $scope.ficheClient = function () {
        $location.path('FicheClients');
    };
    //Redirection vers la fiche Animal
    $scope.ficheAnimaux = function () {
        $rootScope.nouveauAnimal = false;
        $location.path('FicheAnimaux');
    };

    //Désélection d'un animal
    $scope.unSelectRow = function () {
        $rootScope.selectedAnimal = {};
        $rootScope.selectedClient = {};
        $scope.selectedRow = null;
        $scope.selected = false;
    }

    //Sélection d'un animal dans la liste
    $scope.selectionAnimal = function (No_Animal, index) {
        if ($scope.selectedRow != index || $scope.selectedRow == null) {
            $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
            for (var i = 0; i < $scope.listeAnimaux.length; i++) {
                if (No_Animal == $scope.listeAnimaux[i].No_Animal) {
                    $rootScope.selectedAnimal = $scope.listeAnimaux[i];
                    $rootScope.selectedClient.No_Client = $scope.listeAnimaux[i].No_Client
                    $rootScope.selectedClient.Nom = $scope.listeAnimaux[i].Nom
                    $rootScope.selectedClient.Prenom = $scope.listeAnimaux[i].Prenom
                    $rootScope.selectedClient.Adresse = $scope.listeAnimaux[i].Adresse
                    $rootScope.selectedClient.Telephone_Principal = $scope.listeAnimaux[i].Telephone_Principal
                    $scope.selected = true;
                }
            }
        } else {
            $scope.unSelectRow();
        }
    }

    //Système de paging
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
    };

}]);

//--------------------------------------
//Controller Anniversiare
//--------------------------------------
myApp.controller('AnniversaireCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$window', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $window) {

    //Delete le cookie
    $scope.del_cookie = function () {
        $cookies.remove("user");
    };
    //Test si l'authentification
    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };


    //Opération a effectuer au load de la page
    $scope.selected = false;
    var allAnimaux = [];
    $scope.selectedRow = null;
    $rootScope.selectedClient = {};
    $scope.frequence = 7;
    getAnniversaireAnimaux();

    //Appel de la fonction pour récupérer les Animaux
    function getAnniversaireAnimaux() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetAnniversaireAnimaux',
            params: { Action: 'GetAnniversaireAnimaux', Frequence: $scope.frequence },
        }).then(function (reponse) {
            allAnimaux = reponse.data;
            $scope.listeAnimaux = reponse.data;
            $scope.totalItems = $scope.listeAnimaux.length;
        }, function (reponse) {
        });
    }

    //Fonction pour mettre a jour la liste selon la recherche
    $scope.reloadListe = function () {
        getAnniversaireAnimaux();
    }

    //Redirection vers la fiche Client
    $scope.ficheClient = function () {
        $location.path('FicheClients');
    };
    //Redirection vers la fiche Animal
    $scope.ficheAnimaux = function () {
        $rootScope.nouveauAnimal = false;
        $location.path('FicheAnimaux');
    };

    //Désélection d'un animal
    $scope.unSelectRow = function () {
        $rootScope.selectedAnimal = {};
        $rootScope.selectedClient = {};
        $scope.selectedRow = null;
        $scope.selected = false;
    }

    //Sélection d'un animal dans la liste
    $scope.selectionAnimal = function (No_Animal, index) {
        if ($scope.selectedRow != index || $scope.selectedRow == null) {
            $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
            for (var i = 0; i < $scope.listeAnimaux.length; i++) {
                if (No_Animal == $scope.listeAnimaux[i].No_Animal) {
                    $rootScope.selectedAnimal = $scope.listeAnimaux[i];
                    $rootScope.selectedClient.No_Client = $scope.listeAnimaux[i].No_Client
                    $rootScope.selectedClient.Nom = $scope.listeAnimaux[i].Nom
                    $rootScope.selectedClient.Prenom = $scope.listeAnimaux[i].Prenom
                    $rootScope.selectedClient.Adresse = $scope.listeAnimaux[i].Adresse
                    $rootScope.selectedClient.Telephone_Principal = $scope.listeAnimaux[i].Telephone_Principal
                    $scope.selected = true;
                }
            }
        } else {
            $scope.unSelectRow();
        }
    }

    //Système de paging
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
    };

}]);


//--------------------------------------
//Controller Fiche Animal
//--------------------------------------
myApp.controller('ficheAnimauxCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$route', '$window', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $route, $window) {

    $scope.TraitementRegex = /^[a-zA-Z0-9_.,()-]*$/;
    $scope.NomRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'-\s]{0,50}$/;
    $scope.DateVerif = new Date();
    $rootScope.modeModifierDetail = false;
    $scope.date_max = new Date();

    if ($rootScope.nouveauAnimal == true) {
        $scope.newDetail = true;
        $scope.modeModifier = true;
        $rootScope.selectedAnimal = {};
    } else {
        $scope.modeModifier = false;
        $scope.newDetail = false;
        getFicheAnimal();
        getTotalDetail();
    }





    //Appel de la fonction pour ajouter un Animaux
    function postFicheAnimal() {
        $scope.ficheAnimal.Date_Naissance = $scope.date_Naissance.getFullYear() + '-' + ($scope.date_Naissance.getMonth() + 1) + '-' + $scope.date_Naissance.getDate()
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostAnimaux',
            data: {
                newAnimal: $scope.ficheAnimal
            }
        }).then(function (reponse) {
            $scope.modeModifier = false;
            $rootScope.nouveauAnimal = false;
            $rootScope.selectedAnimal = reponse.data
            initCanvas()
            postDetail();
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour ajouter un Animaux
    function putFicheAnimal() {
        $scope.ficheAnimal.Date_Naissance = $scope.date_Naissance.getFullYear() + '-' + ($scope.date_Naissance.getMonth() + 1) + '-' + $scope.date_Naissance.getDate()
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutAnimal',
            data: {
                Animal: $scope.ficheAnimal
            }
        }).then(function (reponse) {
            $scope.modeModifier = false;
            $route.reload();
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer la fiche de l'animal
    function getFicheAnimal() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetFicheAnimal',
            params: { Action: 'GetFicheAnimal', NoAnimal: $rootScope.selectedAnimal.No_Animal },
        }).then(function (reponse) {
            $scope.ficheAnimal = reponse.data;
            $scope.ficheAnimal.Date_Naissance = new Date($scope.ficheAnimal.Date_Naissance)
            $scope.date_Naissance = $scope.ficheAnimal.Date_Naissance
            $scope.date_Naissance.setDate($scope.date_Naissance.getDate() + 1)
            initCanvas();
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour supprimer un RDV
    function delAnimal() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=DelAnimal',
            data: {
                NoAnimal: $rootScope.selectedAnimal.No_Animal
            }
        }).then(function (reponse) {
            $window.history.back();
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer la date de tous les traitements
    function getTotalDetail() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetTotalDetail',
            params: { Action: 'GetTotalDetail', NoAnimal: $rootScope.selectedAnimal.No_Animal },
        }).then(function (reponse) {
            $scope.dateDetail = reponse.data;
            $scope.selectedDetail = $scope.dateDetail[0];
            getDetail();
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer un traitement
    function getDetail() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetDetail',
            params: { Action: 'GetDetail', NoDetail: $scope.selectedDetail.No_Detail },
        }).then(function (reponse) {
            $scope.Detail = reponse.data;
        }, function (reponse) {
        });
    }

    //Appel http de la fonction pour sauvegarder les détails
    function postDetail() {
        $scope.Detail = {};
        $scope.Detail.No_Animal = $rootScope.selectedAnimal.No_Animal;
        $scope.Detail.Date_Detail = new Date().toJSON().slice(0, 10);
        $scope.Detail.Un = "";
        $scope.Detail.Deux = "";
        $scope.Detail.Trois = "";
        $scope.Detail.Quatre = "";
        $scope.Detail.Cinq = "";
        $scope.Detail.Six = "";
        $scope.Detail.Sept = "";
        $scope.Detail.Huit = "";
        $scope.Detail.Neuf = "";
        $scope.Detail.Dix = "";
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostDetail',
            data: { Detail: $scope.Detail },
        }).then(function (reponse) {
            $scope.newDetail = false;
            getTotalDetail();
        }, function (reponse) {
        });
    }

    //Appel http de la fonction pour modifier un détail
    function putDetail() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutDetail',
            data: {
                Detail: $scope.Detail
            }
        }).then(function (reponse) {
            $rootScope.modeModifierDetail = false;
        }, function (reponse) {
        });
    }


    //Fonction pour modifier un animal
    $scope.modifierFunction = function () {
        $scope.backupAnimal = angular.copy($scope.ficheAnimal);
        $scope.modeModifier = true;
    }

    //Fonction pour annuler la modification d'un animal
    $scope.annulerFunction = function () {
        $scope.ficheAnimal = angular.copy($scope.backupAnimal);
        $scope.backupAnimal = [];
        initCanvas();
        if ($rootScope.nouveauAnimal == false) {
            $scope.modeModifier = false;
        }
    }

    //Fonction pour supprimer un animal
    $scope.supprimerFunction = function () {
        delAnimal();
    }

    //Fonction pour enregistrer les modification d'un animal
    $scope.enregistrerFunction = function () {
        if ($rootScope.nouveauAnimal == false) {
            putFicheAnimal();
        } else {
            $scope.ficheAnimal.No_Animal = 0;
            if ($scope.ficheAnimal.Date_Naissance == null) {
                $scope.ficheAnimal.Date_Naissance = new Date().toJSON().slice(0, 10);
            }
            if ($scope.ficheAnimal.Race == null) {
                $scope.ficheAnimal.Race = "";
            }
            if ($scope.ficheAnimal.Maladie_Autres == null) {
                $scope.ficheAnimal.Maladie_Autres = "";
            }
            if ($scope.ficheAnimal.Specifications == null) {
                $scope.ficheAnimal.Specifications = "";
            }
            if ($scope.ficheAnimal.Vacciner == null) {
                $scope.ficheAnimal.Vacciner = 0;
            }
            if ($scope.ficheAnimal.Operer == null) {
                $scope.ficheAnimal.Operer = 0;
            }
            if ($scope.ficheAnimal.Diplome == null) {
                $scope.ficheAnimal.Diplome = 0;
            }
            $scope.ficheAnimal.No_Client = $rootScope.selectedClient.No_Client;
            $scope.ficheAnimal.Date_Ouverture = new Date().toJSON().slice(0, 10);

            postFicheAnimal();
        }
    }


    //Fonction qui permet de sélectionner le bon détail
    $scope.selectDetailFunction = function (no) {
        $scope.selectedDetail = no;
        $rootScope.modeModifierDetail = false;
        initCanvas()
        getDetail();
    }

    //Fonction pour ajouter un nouveau detail
    $scope.newdetailFunction = function () {
        $rootScope.modeModifierDetail = true
        $scope.newDetail = true;
        postDetail();
    }

    //Fonction pour sauvegarder des détails
    $scope.savedetailFunction = function () {
        if ($scope.newDetail == false) {
            putDetail();
        } else {
            postDetail();
        }
    }

    //Fonction pour modifier un détail
    $scope.modifierDetailFunction = function () {
        $scope.backupDetail = angular.copy($scope.Detail);
        $rootScope.modeModifierDetail = true;
    }

    //Fonction pour annuler la modification d'un détail
    $scope.annulerDetailFunction = function () {
        $scope.Detail = angular.copy($scope.backupDetail);
        $scope.backupDetail = [];
        if ($scope.newDetail == false) {
            $rootScope.modeModifierDetail = false;
        }
    }

    //Fonction pour fermer la page
    $scope.fermer = function () {
        $window.history.back();
    }

    //Appel pour initialiser le canvas
    $scope.initCanvas = function () {
        initCanvas();
    }

    //Function pour recevoir la position de la sourie
    function findPos(obj) {
        var curleft = 0, curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return { x: curleft, y: curtop };
        }
        return undefined;
    }
    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    //Initialise le canvas
    function initCanvas() {
        var context = document.getElementById('canvas').getContext("2d");
        var image = new Image();
        image.src = "images/" + $scope.ficheAnimal.Type + ".png";
        image.onload = function () {
            canvas.width = 580;
            canvas.height = 400;
            var wrh = image.width / image.height;
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
            }
            var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
            var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
            context.drawImage(image, xOffset, yOffset, newWidth, newHeight);
        }
    }

    //Function pour recevoir la couleur
    $('#canvas').mousemove(function (e) {
        var pos = findPos(this);
        var x = e.pageX - pos.x;
        var y = e.pageY - pos.y;
        var coord = "x=" + x + ", y=" + y;
        var c = this.getContext('2d');
        var p = c.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        $scope.color = hex
    });

    //Fonction qui permet de donner le focus au bon control
    $scope.focusFunction = function () {
        if ($scope.color == '#53b8cf') {
            document.getElementById('un').focus()
        } else if ($scope.color == '#db0ead') {
            document.getElementById('deux').focus()
        } else if ($scope.color == '#fa6e18') {
            document.getElementById('trois').focus()
        } else if ($scope.color == '#7a9dee') {
            document.getElementById('quatre').focus()
        } else if ($scope.color == '#8337b6') {
            document.getElementById('cinq').focus()
        } else if ($scope.color == '#e3d44d') {
            document.getElementById('six').focus()
        } else if ($scope.color == '#7acf53') {
            document.getElementById('sept').focus()
        } else if ($scope.color == '#0073b7') {
            document.getElementById('huit').focus()
        } else if ($scope.color == '#00a65a') {
            document.getElementById('neuf').focus()
        } else if ($scope.color == '#f39c12') {
            document.getElementById('dix').focus()
        }
    }

}]);
//--------------------------------------
//Controller Fiche Client
//--------------------------------------
myApp.controller('ficheClientCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$route', '$mdDialog', '$window', 'printer', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $route, $mdDialog, $window, printer) {

    //Opération a effectuer au load de la page 
    $scope.Client = {};
    $scope.Animals = [];
    getSetting();
    var Rdv = {};
    var Service = {};
    var Animal = {};
    Animal.Rdv = [];
    Rdv.Service = [];
    $scope.Impression = {};
    $rootScope.selectedAnimal = {};
    $scope.EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $scope.NomRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'-\s]{0,50}$/;
    $scope.PrenomRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'-\s]{0,50}$/;
    $scope.AdresseRegex = /[A-Za-z0-9'\.\-\s\,]{0,150}$/;


    //Vérifit si c'est un nouveau client
    if ($rootScope.nouveauClient == true) {
        $scope.modeModifier = true;
        $rootScope.selectedClient = {};
    } else {
        $scope.modeModifier = false;
        getFicheClient();
    }

    //Appel de la fonction pour récupérer la liste complette du client
    function getFicheClient() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetFicheClient',
            params: { Action: 'GetFicheClient', No_Client: $rootScope.selectedClient.No_Client },
        }).then(function (reponse) {
            $scope.Client = reponse.data;
            $rootScope.selectedClient = reponse.data
            getAnimauxClient();
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour enregistrer les données d'un nouveau client
    function postClient() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostClient',
            data: {
                newClient: $scope.Client
            }
        }).then(function (reponse) {
            $scope.modeModifier = false;
            $rootScope.nouveauClient = false;
            $rootScope.selectedClient = reponse.data
            getFicheClient()
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour enregistrer les modifications d'un client
    function putFicheClient() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutFicheClient',
            data: {
                Client: angular.copy($scope.Client)
            }
        }).then(function (reponse) {
            $scope.modeModifier = false;
            getFicheClient()
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour récupérer la liste complette du client
    function getAnimauxClient() {
        console.log($rootScope.selectedClient.No_Client)
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetAnimauxClient',
            params: { Action: 'GetAnimauxClient', No_Client: $rootScope.selectedClient.No_Client },
        }).then(function (reponse) {
            for (var i = 0; i < reponse.data.length; i++) {
                Animal.No_Animal = reponse.data[i].No_Animal;
                Animal.Type = reponse.data[i].Type;
                Animal.Comportement = reponse.data[i].Comportement;
                Animal.Nom_Animal = reponse.data[i].Nom_Animal;
                $scope.Animals.push(angular.copy(Animal))
            };
            for (var i = 0; i < $scope.Animals.length; i++) {
                getRdvAnimaux($scope.Animals[i].No_Animal, i)
            }
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour récupérer la liste des RDV par animaux
    function getRdvAnimaux(NoAnimal, pos) {
        console.log(NoAnimal);
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetRdvAnimaux',
            params: { Action: 'GetRdvAnimaux', No_Animal: NoAnimal },
        }).then(function (reponse) {
            for (var i = 0; i < reponse.data.length; i++) {
                Rdv.No_Rdv = reponse.data[i].No_Rdv;
                Rdv.Heure_Debut = reponse.data[i].Heure_Debut;
                Rdv.Heure_Fin = reponse.data[i].Heure_Fin;
                Rdv.Details = reponse.data[i].Details;
                Rdv.Date_Rdv = reponse.data[i].Date_Rdv;
                $scope.Animals[pos].Rdv.push(angular.copy(Rdv))
                getServiceRDV(Rdv.No_Rdv, pos, i)
            }
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour récupérer la les services d'un RDV
    function getServiceRDV(NoRdv, pos, posRdv) {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetServiceRDV',
            params: { Action: 'GetServiceRDV', No_Rdv: NoRdv },
        }).then(function (reponse) {
            for (var i = 0; i < reponse.data.length; i++) {
                Service.No_Service = reponse.data[i].No_Service;
                Service.Nom_Service = reponse.data[i].Nom_Service;
                Service.No_Detail = reponse.data[i].No_Detail;
                Service.Date_Detail = reponse.data[i].Date_Detail;
                $scope.Animals[pos].Rdv[posRdv].Service.push(angular.copy(Service))
            }
        }, function (reponse) {
        });
    };


    //Fonction pour modifier un client
    $scope.modifierFunction = function () {
        $scope.backupClient = angular.copy($scope.Client);
        $scope.modeModifier = true;
    }

    //Fonction pour annuler la modification
    $scope.annulerFunction = function () {
        $scope.Client = angular.copy($scope.backupClient);
        $scope.backupClient = [];
        if ($rootScope.nouveauClient == false) {
            $scope.modeModifier = false;
        }
    }

    //Fonction pour attribuer une valeur au checkbox
    $scope.actifFunction = function () {
        if ($scope.Client.Actif == 1) {
            $scope.Client.Actif = 0;
        } else if ($scope.Client.Actif == 0) {
            $scope.Client.Actif = 1;
        }
    }

    //Fonction pour enregistrer les modification
    $scope.enregistrerFunction = function () {
        if ($rootScope.nouveauClient == false) {
            putFicheClient();
        } else {
            //vérifier si le client existe dans la base de donnée
            $scope.VerifClient = [];
            for (var i = 0; i < $rootScope.listeClients.length; i++) {
                var cpt = 0;
                if ($rootScope.listeClients[i].Prenom.toLowerCase() == $scope.Client.Prenom.toLowerCase()) {
                    cpt += 2;
                }
                if ($rootScope.listeClients[i].Nom.toLowerCase() == $scope.Client.Nom.toLowerCase()) {
                    cpt += 2;
                }
                if ($rootScope.listeClients[i].Telephone_Principal == $scope.Client.Telephone_Principal) {
                    cpt += 3;
                }
                if ($rootScope.listeClients[i].Adresse.toLowerCase() == $scope.Client.Adresse.toLowerCase()) {
                    cpt += 3;
                }
                if (cpt >= 3) {
                    $scope.VerifClient.push($rootScope.listeClients[i])
                }
            }
            if ($scope.VerifClient.length > 0) {
                $scope.VerifClientModal();
            } else {
                NewClient();
            }
        }
    }

    //Fonction qui permet l'enregistrement
    function NewClient() {
        $scope.Client.No_Client = 0;
        $scope.Client.Actif = 1;
        $scope.Client.Date_Creation = new Date().toJSON().slice(0, 10);
        $scope.Client.En_Attente = 0;
        $scope.Client.Note_Attente = "";
        if ($scope.Client.Telephone_Secondaire == null) {
            $scope.Client.Telephone_Secondaire = "";
        }
        if ($scope.Client.Email == null) {
            $scope.Client.Email = "";
        }
        if ($scope.Client.Code_Postal == null) {
            $scope.Client.Code_Postal = "";
        }
        if ($scope.Client.Note == null) {
            $scope.Client.Note = "";
        }
        if ($scope.Client.Referer_Par == null) {
            $scope.Client.Referer_Par = "";
        }
        if ($scope.Client.Num_Acomba == null) {
            $scope.Client.Num_Acomba = "";
        }
        postClient();
    }

    //Fonction nouvelle fiche animal
    $scope.newanimalFunction = function () {
        $rootScope.nouveauAnimal = true;
        $location.path('FicheAnimaux');
    }

    //Function qui se diriger vers la fiche animal
    $scope.ficheAnimalFunction = function (No_Animal) {
        $rootScope.nouveauAnimal = false;
        $rootScope.selectedAnimal.No_Animal = No_Animal;
        $location.path('FicheAnimaux');
    }

    //Fonction pour fermer la page
    $scope.fermer = function () {
        $window.history.back();
    }

    //Load un fenêtre modal pour la vérification si client existant
    $scope.VerifClientModal = function () {
        $mdDialog.show({
            controller: 'verifCtrl',
            templateUrl: 'Views/VerifClientModal.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true,
            locals: { data: $scope.VerifClient },
        })
        .then(function (answer) {
            $scope.status = 'Fenêtre ouverte';
            if (answer == 'Nouveau') {
                NewClient();
            } else if (answer == "Fermer") {

            } else {
                $rootScope.selectedClient.No_Client = answer
                $rootScope.nouveauClient = false
                $scope.modeModifier = false;
                getFicheClient();
            }
        }, function () {
            $scope.status = 'Fenêtre annuler';
        });
    };


    //Load un fenêtre modal du rdv sélectionné
    $scope.loadrdvFunction = function (ev, rdv, animal, where) {
        $rootScope.selectedRDV = rdv;
        $rootScope.selectedAnimal = animal;
        $rootScope.loadFrom = where
        if (where == 'animal') {
            $rootScope.NewRdv = true;
        } else {
            $rootScope.NewRdv = false;
        }
        $mdDialog.show({
            controller: 'rdvCtrl',
            templateUrl: 'Views/GestionRDV.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (answer) {
            $scope.status = 'Fenêtre ouverte';
        }, function () {
            $scope.status = 'Fenêtre annuler';
        });
    };


    //Permet de retourner les setting
    function getSetting() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetSetting',
            params: { Action: 'GetSetting' },
        }).then(function (reponse) {
            $scope.entreprise = reponse.data;
        });
    };



    //Fonction qui permet d'imprimmer un rapport des rendez vous d'un client
    $scope.ListeRDV = function () {
        var entreprise = {
            model: {
                entreprise: $scope.entreprise,
                client: $scope.Client,
                animals: $scope.Animals
            }
        }
        printer.print("views/RaportPourImpression.html", entreprise);
    }

    //Permet de supprimer un RDV
    $scope.supprimerRdvFunction = function (rdv, animal) {
        rdv.No_Animal = animal.No_Animal
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=DelRDV',
            data: { RDV: rdv }
        }).then(function (reponse) {
            $route.reload();
        }, function (reponse) {
        });
    }


}]);

//--------------------------------------
//Controller pour la modal des vérification client
//--------------------------------------
myApp.controller('verifCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$route', '$mdDialog', 'data', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $route, $mdDialog, data) {
    $scope.isSelected = false
    $scope.VerifClient = data

    //Nouveau client pour la modal de vérif Client
    $scope.Nouveau = function (answer) {
        $mdDialog.hide(answer);
    };
    //Cancel pour la modal de vérif Client
    $scope.cancel = function (answer) {
        $mdDialog.hide(answer);
    };
    //Afficher pour la modal vérif Client
    $scope.Afficher = function (answer) {
        $mdDialog.hide($rootScope.selectedClient.No_Client);
    };

    //Sélection d'un client dans la fenêtre modal de la vérif client
    $scope.selectionClientVerif = function (No_Client, index) {
        $scope.isSelected = true;
        if (index == $scope.indexSupp) {
            $scope.isSelected = false;
            index = null;
        } else {
            $scope.isSelected = true;
        }
        $scope.selectedRow = ($scope.selectedRow == index) ? null : index;

        for (var i = 0; i < $scope.VerifClient.length; i++) {
            if (No_Client == $scope.VerifClient[i].No_Client) {
                $rootScope.selectedClient.No_Client = No_Client;
            }
        }
        $scope.indexSupp = index;
    }


}])


//--------------------------------------
//Controller pour gestion des RDV
//--------------------------------------
myApp.controller('rdvCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$route', '$mdDialog', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $route, $mdDialog) {

    //Opération a effectuer au load de la page  
    $scope.Client = $rootScope.selectedClient
    $scope.Animal = $rootScope.selectedAnimal
    $scope.date_min = new Date();
    $scope.newRDV = $rootScope.NewRdv;
    $scope.loadFrom = $rootScope.loadFrom;
    $scope.Animals = $rootScope.listeAnimaux;
    $scope.dateDetail = $rootScope.allDetail;
    $scope.addService = false;
    getService();
    var loadDateRdv;
    $scope.isRequired = true;

    switch ($scope.loadFrom) {
        case 'animal': {
            getTotalDetail();
            var Service = {};
            $scope.RDV = {};
            $scope.RDV.Service = [];
            break;
        }
        case 'attente': {
            var Service = {};
            getAnimauxClient();
            $scope.RDV = {};
            $scope.RDV.Service = [];
            break;
        }
        case 'RDV': {
            getTotalDetail();
            $scope.RDV = $rootScope.selectedRDV;
            $rootScope.Service = $scope.RDV.Service

            $scope.Heure_Fin = parseInt($scope.RDV.Heure_Fin.slice(0, 2))
            $scope.Min_Fin = parseInt($scope.RDV.Heure_Fin.slice(3, 5))
            $scope.Heure_Debut = parseInt($scope.RDV.Heure_Debut.slice(0, 2))
            $scope.Min_Debut = parseInt($scope.RDV.Heure_Debut.slice(3, 5))

            $scope.RDV.Date_Rdv = new Date($scope.RDV.Date_Rdv)
            $scope.date_show = $scope.RDV.Date_Rdv
            $scope.date_show.setDate($scope.date_show.getDate() + 1)
            loadDailyRdv($scope.date_show.getFullYear() + '-' + ($scope.date_show.getMonth() + 1) + '-' + $scope.date_show.getDate());
            break;
        }
        case 'calendar': {
            $scope.RDV = $rootScope.selectedRDV;
            $scope.filtre = "";
            getClients();
            var Service = {};
            $scope.RDV.Service = [];

            $scope.Heure_Fin = parseInt($scope.RDV.Heure_Fin.slice(0, 2))
            $scope.Min_Fin = parseInt($scope.RDV.Heure_Fin.slice(3, 5))
            $scope.Heure_Debut = parseInt($scope.RDV.Heure_Debut.slice(0, 2))
            $scope.Min_Debut = parseInt($scope.RDV.Heure_Debut.slice(3, 5))

            $scope.RDV.Date_Rdv = new Date($scope.RDV.Date_Rdv)
            $scope.date_show = $scope.RDV.Date_Rdv
            $scope.date_show.setDate($scope.date_show.getDate() + 1)
            loadDailyRdv($scope.date_show.getFullYear() + '-' + ($scope.date_show.getMonth() + 1) + '-' + $scope.date_show.getDate());
            break
        }
        default:
            break;
    }

    //Fonction pour afficher les heures automatique
    $scope.addHeure = function (heure) {
        $scope.isRequired = false;
        if (heure == 'midi') {
            $scope.RDV.Heure_Debut = '13:00:00';
            $scope.RDV.Heure_Fin = '17:00:00'
        } else if (heure == 'matin') {
            $scope.RDV.Heure_Debut = '08:00:00';
            $scope.RDV.Heure_Fin = '12:00:00'
        }
        $scope.Heure_Fin = parseInt($scope.RDV.Heure_Fin.slice(0, 2))
        $scope.Min_Fin = parseInt($scope.RDV.Heure_Fin.slice(3, 5))
        $scope.Heure_Debut = parseInt($scope.RDV.Heure_Debut.slice(0, 2))
        $scope.Min_Debut = parseInt($scope.RDV.Heure_Debut.slice(3, 5))
    }


    //Fonction pour afficher les RDV selon la journée choisit
    $scope.dayRdvFunction = function () {
        loadDailyRdv($scope.date_show.getFullYear() + '-' + ($scope.date_show.getMonth() + 1) + '-' + $scope.date_show.getDate());
    }

    //Permet de loader les RDV pour toute la journée
    function loadDailyRdv(Date) {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetDayRDV',
            params: { Date: Date },
        }).then(function (reponse) {
            $scope.DayRDV = reponse.data
        }, function (reponse) {
        });
    }

    //Cancel pour la modal primaire des RDV
    $scope.cancel = function (answer) {
        $mdDialog.hide(answer);
        $route.reload();
    };
    //Enregistrer pour la modal primaire
    $scope.answer = function (answer) {
        $scope.RDV.Heure_Fin = $scope.Heure_Fin + ':' + $scope.Min_Fin
        $scope.RDV.Heure_Debut = $scope.Heure_Debut + ':' + $scope.Min_Debut
        $scope.RDV.Date_Rdv = $scope.date_show.getFullYear() + '-' + ($scope.date_show.getMonth() + 1) + '-' + $scope.date_show.getDate()
        if ($scope.loadFrom == 'RDV') {
            putRDV();
        } else if ($scope.loadFrom == 'calendar' || $scope.loadFrom == 'animal' || $scope.loadFrom == 'attente') {
            if ($scope.RDV.Details == null) {
                $scope.RDV.Details = '';
            }
            postRDV();
        }
        $mdDialog.hide(answer);
        $route.reload();
    };

    //Supprimer pour la modal primaire
    $scope.supprimer = function (answer) {
        supprimerRdvFunction()
        $route.reload();
        $mdDialog.hide(answer);
    }

    //Permet de supprimer un RDV
    function supprimerRdvFunction() {
        $scope.RDV.No_Animal = $scope.Animal.No_Animal
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=DelRDV',
            data: { RDV: $scope.RDV }
        }).then(function (reponse) {
            $route.reload();
        }, function (reponse) {
        });
    }
    //Fonction pour appler une modal pour les Détails
    $scope.detailSelectionFunction = function (ev) {
        $mdDialog.show({
            controller: 'rdvCtrl',
            multiple: true,
            templateUrl: 'Views/ModalDetail.html',
            preserveScope: true,
            targetEvent: ev,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (reponse) {
            $scope.RDV.Service = $rootScope.Service
            for (var i = 0; i < $scope.RDV.Service.length; i++) {
                if ($scope.RDV.Service[i].No_Service == 1) {
                    $scope.RDV.Service[i].Date_Detail = reponse.Date_Detail
                    $scope.RDV.Service[i].No_Detail = reponse.No_Detail
                }
            }
        });
    }

    //Fonction pour appler une modal pour les clients
    $scope.clientSelectionFunction = function (ev) {
        $mdDialog.show({
            controller: 'rdvCtrl',
            multiple: true,
            targetEvent: ev,
            templateUrl: 'Views/ModalClient.html',
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (reponse) {
            $scope.Client.No_Client = reponse.No_Client
            $scope.Client.Prenom = reponse.Prenom
            $scope.Client.Nom = reponse.Nom
            getAnimauxClient()
        });
    }

    //Fonction pour appler une modal pour les animaux
    $scope.animalSelectionFunction = function (ev) {
        $mdDialog.show({
            controller: 'rdvCtrl',
            multiple: true,
            targetEvent: ev,
            templateUrl: 'Views/ModalAnimaux.html',
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (reponse) {
            $scope.Animal.No_Animal = reponse.No_Animal;
            $scope.Animal.Nom_Animal = reponse.Nom_Animal;
            $scope.Animal.Comportement = reponse.Comportement;
            $scope.Animal.Type = reponse.Type;
            getTotalDetail();
        });
    }
    //Pour le cancel de la modal
    $scope.cancelModalSelection = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.answerModalDetail = function (answer) {
        $mdDialog.hide(answer);
    };


    //Appel de la fonction pour récupérer la date de tous les traitements
    function getTotalDetail() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetTotalDetail',
            params: { Action: 'GetTotalDetail', NoAnimal: $rootScope.selectedAnimal.No_Animal },
        }).then(function (reponse) {
            $rootScope.allDetail = reponse.data;
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer la date de tous les traitements
    function getService() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetService',
            params: { Action: 'GetService' },
        }).then(function (reponse) {
            $scope.Service = reponse.data;
        }, function (reponse) {
        });
    }


    //Appel de la fonction pour récupérer la liste complette du client
    function postRDV() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PostRDV',
            data: {
                newRDV: $scope.RDV, Animal: $scope.Animal
            }
        }).then(function (reponse) {
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour sauvegarder les changement
    function putRDV() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutRDV',
            data: { RDV: $scope.RDV }
        }).then(function (reponse) {
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer les clients
    function getClients() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetClients' }
        }).then(function (reponse) {
            $scope.listeClients = reponse.data;
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour récupérer la liste complette du client
    function getAnimauxClient() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetAnimauxClient',
            params: { Action: 'GetAnimauxClient', No_Client: $scope.Client.No_Client },
        }).then(function (reponse) {
            $rootScope.listeAnimaux = reponse.data;
        }, function (reponse) {
        });
    };

    //Fonction pour supprimer un service
    $scope.deleteServiceFunction = function (service) {
        for (var i = 0; i < $scope.RDV.Service.length; i++) {
            if ($scope.RDV.Service[i].No_Service == service.No_Service) {
                $scope.RDV.Service.splice(i, 1)
            }
        }
    }

    //Fonction pour ajouter un service
    $scope.addServiceFunction = function () {
        var inclue = false;
        for (var i = 0; i < $scope.RDV.Service.length; i++) {
            if ($scope.RDV.Service[i].No_Service == $scope.selectionService) {
                inclue = true;
            }
        }
        if (inclue == false) {
            for (var i = 0; i < $scope.Service.length; i++) {
                if ($scope.Service[i].No_Service == $scope.selectionService) {
                    $scope.Service[i].No_Detail = null;
                    $scope.RDV.Service.push($scope.Service[i])
                    $rootScope.Service = $scope.RDV.Service
                }
            }
        }
    }

    //Fonction pour désactiver le bouton enregister
    $scope.disableFunction = function () {
        for (var i = 0; i < $scope.RDV.Service.length; i++) {
            if ($scope.RDV.Service[i].No_Service == 1 && $scope.RDV.Service[i].Date_Detail == null) {
                return true;
            }
        }
        return false;
    }

}]);




//--------------------------------------
//Controller pour le calendrier
//--------------------------------------
myApp.controller('calendrierCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', 'uiCalendarConfig', '$window', '$route', '$mdDialog', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, uiCalendarConfig, $window, $route, $mdDialog) {

    //  var isFirstTime;
    var firstClick = false;
    var eventClick;
    $scope.refresh = false;
    $scope.listeRDV = [];
    var Service = {};
    $scope.listeRDV.Service = [];
    loadFunction();

    //Oprération a effectuer au load de la page
    function loadFunction() {
        getListeRDV();
        $scope.events = [];
        $scope.eventSources = [$scope.events];
        calendarConfig();
    }

    //Appel de la fonction pour récupérer la liste des RDV par animaux
    function getListeRDV() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetListeRDV',
            params: { Action: 'GetListeRDV' },
        }).then(function (reponse) {
            $scope.listeRDV = reponse.data
            for (var i = 0; i < reponse.data.length; i++) {
                var couleur;
                if (reponse.data[i].Type == "Chien") {
                    couleur = "blue";
                } else {
                    couleur = "green";
                }
                $scope.listeRDV[i].title = reponse.data[i].Prenom + " " + reponse.data[i].Nom + '\n' + '(' + reponse.data[i].Telephone_Principal.slice(0, 3) + ') ' + reponse.data[i].Telephone_Principal.slice(3, 6) + '-' + reponse.data[i].Telephone_Principal.slice(6, 10) + '\n' + 'Description: ' + reponse.data[i].Details
                $scope.listeRDV[i].description = reponse.data[i].Details
                $scope.listeRDV[i].start = reponse.data[i].Date_Rdv + " " + reponse.data[i].Heure_Debut
                $scope.listeRDV[i].end = reponse.data[i].Date_Rdv + " " + reponse.data[i].Heure_Fin
                $scope.listeRDV[i].color = couleur
                $scope.listeRDV[i].stick = true
                getServiceRDV($scope.listeRDV[i].No_Rdv, i)
            }
        }, function (reponse) {
        });
    };

    //Appel de la fonction pour récupérer la les services d'un RDV
    function getServiceRDV(NoRdv, posRdv) {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetServiceRDV',
            params: { Action: 'GetServiceRDV', No_Rdv: NoRdv },
        }).then(function (reponse) {
            $scope.listeRDV[posRdv].Service = []
            for (var i = 0; i < reponse.data.length; i++) {
                Service.No_Service = reponse.data[i].No_Service;
                Service.Nom_Service = reponse.data[i].Nom_Service;
                Service.No_Detail = reponse.data[i].No_Detail;
                Service.Date_Detail = reponse.data[i].Date_Detail;
                $scope.listeRDV[posRdv].Service.push(angular.copy(Service))
            }
            $scope.events.push($scope.listeRDV[posRdv]);
        }, function (reponse) {
        });
    };

    //configure calendar
    function calendarConfig() {
        $scope.uiConfig = {
            calendar: {
                timezone: 'local',
                ignoreTimezone: false,
                height: "auto",
                nowIndicator: true,
                editable: false,
                displayEventTime: true,
                defaultView: 'agendaWeek',
                selectable: true,
                nowIndicator: true,
                slotDuration: '00:10:00',
                minTime: '08:00:00',
                maxTime: '17:00:00',
                showNonCurrentDates: false,
                hiddenDays: [0, 6],
                header: {
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                businessHours: {
                    start: '08:00',
                    end: '17:00',
                },
                select: function (date, event) {
                    if (firstClick == false) {
                        firstClick = true;
                        eventClick = event._i.toString();
                        return;
                    } else if (firstClick == true && eventClick == event._i) {
                        firstClick = false;

                        var eventDate = new Date(date._d)
                        var time = ("0" + eventDate.getHours()).slice(-2) + ":" + ("0" + eventDate.getMinutes()).slice(-2);
                        var date = moment(date.format("YYYY-MM-DD"))
                        date = date._i;

                        //Vérifit si c'est un click sur un mois
                        if (event._i === parseInt(event._i, 10)) {
                            time = "08:00"
                        }
                        var RDV = {};
                        RDV.Date_Rdv = date;
                        RDV.Heure_Debut = time;
                        if (RDV.Heure_Debut < "12:00") {
                            RDV.Heure_Fin = "12:00"
                        } else {
                            RDV.Heure_Fin = "17:00"
                        }
                        $rootScope.selectedClient = {};
                        loadrdvFunction(event, RDV, {}, 'calendar')
                    } else {
                        firstClick = true;
                        eventClick = event._i.toString();
                        return;
                    }


                },
                eventClick: function (event) {
                    $rootScope.selectedClient = event
                    loadrdvFunction(event, event, event, 'RDV')
                },
            }
        }
    };

    //Load un fenêtre modal du rdv sélectionné
    function loadrdvFunction(ev, rdv, animal, where) {
        rdv.end = {}
        rdv.source = {}
        rdv.start = {}
        rdv.className = {}
        $rootScope.selectedRDV = rdv;
        $rootScope.selectedAnimal = animal;
        $rootScope.loadFrom = where
        if (where == 'calendar') {
            $rootScope.NewRdv = true;
        } else {
            $rootScope.NewRdv = false;
        }
        $mdDialog.show({
            controller: 'rdvCtrl',
            templateUrl: 'Views/GestionRDV.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (answer) {
            $scope.status = 'Fenêtre ouverte';
        }, function () {
            $scope.status = 'Fenêtre annuler';
        });
    };

}]);


//--------------------------------------
//Controller pour le Liste Attente
//--------------------------------------
myApp.controller('ListeAttenteCtrl', ['$scope', '$rootScope', '$http', '$location', '$rootScope', '$cookies', '$mdDialog', '$route', '$window', function ($scope, $rootScope, $http, $location, $rootScope, $cookies, $mdDialog, $route, $window) {
    //Opération a effectuer au load de la page
    var allClients = []; //
    $scope.Client = {};
    $scope.customResult = null;
    $scope.ModeAttente = false;
    $scope.selectedRow = null;
    $scope.listeClients = [];
    $scope.listeClientsModal = [];
    getClients();

    //Delete le cookie
    $scope.del_cookie = function () {
        $cookies.remove("user");
    };
    //Test si l'authentification
    var test = $cookies.getObject('user');
    if ($cookies.getObject('user')) {
        $rootScope.IsConnected = true;
    } else {
        $rootScope.IsConnected = false;
    };

    //Sélection d'un client dans la liste
    $scope.selectionAttente = function (No_Client, index, Note_Attente) {
        $scope.ModeAttente = true;
        if (index == $scope.indexSupp) {
            $scope.ModeAttente = false;
            index = null;
        } else {
            $scope.ModeAttente = true;
        }
        $scope.selectedRow = ($scope.selectedRow == index) ? null : index;

        for (var i = 0; i < $scope.listeClients.length; i++) {
            if (No_Client == $scope.listeClients[i].No_Client) {
                $rootScope.selectedClient = $scope.listeClients[i];
            }
        }
        $scope.indexSupp = index;
    }


    //Sélection d'un client dans la liste modal
    $scope.selectionAttenteModal = function (No_Client, index) {
        $scope.ModeAttente = true;
        if (index == $scope.indexSupp) {
            $scope.ModeAttente = false;

            index = null;

        } else {
            $scope.ModeAttente = true;
        }
        $scope.selectedRow = ($scope.selectedRow == index) ? null : index;

        for (var i = 0; i < $scope.listeClientsModal.length; i++) {
            if (No_Client == $scope.listeClientsModal[i].No_Client) {
                $rootScope.selectedClient.No_Client = No_Client;
            }
        }
        $scope.indexSupp = index;
    }

    //Désélection d'un client
    $scope.unSelectRow = function () {
        $scope.selectedRow = null;
    }

    //Appel de la fonction pour récupérer les clients
    function getClients() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php',
            params: { Action: 'GetClients' }
        }).then(function (reponse) {
            $scope.listeClients = [];
            allClients = reponse.data;
            for (var i = 0; i < reponse.data.length; i++) {
                if (reponse.data[i].En_Attente == 1) {
                    $scope.listeClients.push(reponse.data[i])
                } else {
                    $scope.listeClientsModal.push(reponse.data[i])
                }
            }
            $scope.totalItems = $scope.listeClients.length;
        }, function (reponse) {
        });
    }

    //Appel de la fonction pour enregistrer les données d'un client
    function putFicheClient() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutFicheClientAttente',
            data: {
                Client: $scope.client
            }
        }).then(function (reponse) {
            getClients()
            $route.reload();
        }, function (reponse) {
        });
    };

    //ici le code pour la fenetre modal Liste attente
    $scope.showAjouterListeAttente = function (ev) {
        $scope.ModeAttente = false;
        $scope.selectedRow = null;
        $rootScope.selectedClient = {};
        $mdDialog.show({
            controller: 'ListeAttenteCtrl',
            templateUrl: 'Views/En_AttenteModal.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen,
            autoWrap: true
        })
        .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
    };

    //Fonction pour enlever un client qui etait en attente
    $scope.supressionEnAttente = function () {
        $scope.client = {};
        $scope.client.No_Client = $rootScope.selectedClient.No_Client;
        $scope.client.Note_Attente = "";
        $scope.client.Attente_Depuis = "";
        $scope.client.boolAttente = true;
        $scope.client.En_Attente = 0;
        putFicheClient();
    }

    //Résultat sur la modal
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function (answer) {
        $mdDialog.hide(answer);
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
        $scope.client = {};
        for (var i = 0; i < $scope.listeClientsModal.length; i++) {
            if ($scope.listeClientsModal[i].No_Client == $rootScope.selectedClient.No_Client) {
                $scope.client.Note_Attente = $scope.listeClientsModal[i].Note_Attente;
            }
        }
        $scope.client.No_Client = $rootScope.selectedClient.No_Client;
        $scope.client.boolAttente = false;
        $scope.client.En_Attente = 1;
        $scope.client.Attente_Depuis = new Date().toJSON().slice(0, 10);
        putFicheClient();
    };

    //Load un fenêtre modal du rdv sélectionné
    $scope.loadrdvFunction = function (ev, where) {
        $scope.Client.No_Client = $rootScope.selectedClient.No_Client
        $rootScope.selectedRDV = {};
        $rootScope.selectedAnimal = {};
        $rootScope.loadFrom = where
        $rootScope.NewRdv = true;
        $mdDialog.show({
            controller: 'rdvCtrl',
            templateUrl: 'Views/GestionRDV.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: true,
            autoWrap: true
        })
        .then(function (answer) {
            if (answer == 'enregistrer') {
                $scope.supressionEnAttente();
            }
            $scope.status = 'Fenêtre ouverte';
        }, function () {
            $scope.status = 'Fenêtre annuler';
        });
    };

    //Fonction pour fermer la page
    $scope.fermer = function () {
        $window.history.back();
    }

    //Système de paging
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
    };
}])


//--------------------------------------
//Controller pour Parametre generaux
//--------------------------------------
myApp.controller('ParametreGenerauxCtrl', ['$scope', '$http', '$location', '$cookies', '$window', function ($scope, $http, $location, $cookies, $window) {
    $scope.entreprise = {}
    $scope.EmailRegex = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.NomRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._'-\s]{0,50}$/;
    $scope.motDePasseRegex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._-\s]{0,50}$/;
    $scope.AdresseRegex = /[A-Za-z0-9'\.\-\s\,]{0,150}$/;


    //Call de la fonction pour récuperer les settings
    getSetting();
    //Fonction pour effectuer une sauvegarde
    $scope.postSave = function () {
        var d = new Date()
        var curr_day = d.getDate();
        var curr_month = d.getMonth();
        curr_month++;
        var curr_year = d.getFullYear();
        $scope.datecourante = new Date((curr_year + "-" + curr_month + "-" + curr_day));
        $scope.DateSauvegardeTemp = new Date(($scope.entreprise.DateSauvegarde));
        $scope.date = curr_year + "-" + curr_month + "-" + curr_day;
        if ($scope.entreprise.Frequence == 0) {
            if ($scope.DateSauvegardeTemp < $scope.datecourante) {
                save(d.getDate() + 1, d.getMonth())
            }
        } else if ($scope.entreprise.Frequence == 1) {
            if ($scope.entreprise.DateSauvegarde < $scope.datecourante) {
                save(d.getDate() + 7, d.getMonth())
            }
        } else {
            if ($scope.entreprise.DateSauvegarde < $scope.datecourante) {
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
        $scope.entreprise.DateSauvegarde = $scope.date
        EnregistrerModif();
    }

    //Appel de la fonction pour récupérer les paramètre de sauvegarde
    function getSetting() {
        $http({
            method: 'GET',
            url: 'api/controllersPHP.php?Action=GetSetting',
            params: { Action: 'GetSetting' },
        }).then(function (reponse) {
            $scope.entreprise = reponse.data;
        });
    };

    //Fonction pour modifier un client
    $scope.modifierFunction = function () {
        $scope.backupEntreprise = angular.copy($scope.entreprise);
        $scope.modeModifier = true;
    }

    //Fonction pour annuler la modification
    $scope.annulerFunction = function () {
        $scope.entreprise = angular.copy($scope.backupEntreprise);
        $scope.Confirmation = "";
        $scope.modeModifier = false;
        $scope.backupEntreprise = [];
    }

    //Fonction pour fermer la page
    $scope.fermer = function () {
        $window.history.back();
    }
    $scope.EnregistrerModif = function () {
        EnregistrerModif();
    }
    //Appel de la fonction pour ajouter un Animaux
    function EnregistrerModif() {
        $http({
            method: 'POST',
            url: 'api/controllersPHP.php?Action=PutSetting',
            data: {
                sauvegarde: $scope.entreprise
            }
        }).then(function (reponse) {
            $scope.modeModifier = false;
        }, function (reponse) {
        });
    }
}]);
