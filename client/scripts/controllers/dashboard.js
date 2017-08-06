'use strict';

angular.module($snaphy.getModuleName())
//Controller for dashboardControl ..
.controller('dashboardControl', ['$scope', '$stateParams','Database', 'Resource', "RunTimeDatabase", "$rootScope", "LoginServices",
    function($scope, $stateParams, Database, Resource, RunTimeDatabase, $rootScope, LoginServices) {
        //Set snaphy default template value to true..
        $snaphy.setDefaultTemplate(true);
        //Adding the login state from the login plugins..
        $scope.loginState  = $snaphy.loadSettings('login', "loginState");
        $scope.homeState   = $snaphy.loadSettings('dashboard', "homeState");
        $scope.companyName   = $snaphy.loadSettings('dashboard', "companyName");
        //Load all the databases list..
        //$scope.databasesList = $snaphy.loadSettings('robustAutomata', "loadDatabases");
        //Listen to login changes..
        var LOGIN_EVENT       = $snaphy.loadSettings('login', "login_event_name");
        $scope.schemaArray = [];
        var dataFetched = false;
        //Load the constructor ...for dashboard..
        //Call this constructor at ui loadin dashboard.html page..
        $scope.init = function(){
            RunTimeDatabase.load()
                .then(function (list) {
                    $scope.databasesList = list;
                    $scope.databasesList.forEach(function(databaseName){
                        getDatabase(databaseName);
                    });
                })
                .catch(function (error) {
                    //Ignore..
                });
        };


        var getDatabase = function(databaseName) {
            $scope.isLoading = true;
            //First get the schema..
            Resource.getSchema(databaseName,function (schema) {
                //Populate the schema..
                $scope.schemaArray.push(schema);
            }, function (httpResp) {
                console.error(httpResp);
            });
        };


        if(LOGIN_EVENT){
            //Listen for login changes..
            $rootScope.$on(LOGIN_EVENT, function (event, acl) {
                LoginServices.addUserDetail.setRoles(null);
                RunTimeDatabase.load()
                    .then(function (list) {
                        $scope.databasesList = list;
                        $scope.databasesList.forEach(function(databaseName){
                            getDatabase(databaseName);
                        });
                    })
                    .catch(function (error) {
                        //Ignore..
                    });

            });
        }



    }//controller function..
]);