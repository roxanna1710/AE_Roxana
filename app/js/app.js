'use strict'
let app = angular.module('SubsidiaryModule', [
    'ui.router',
    'subsidiaryModule'
    ])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/Welcome')
    $stateProvider
       .state('startPage', {
            url : '/Welcome',
            templateUrl : 'views/startPage.html',
            
        })
        .state('subsidiaries', {
            url : '/subsidiaries',
            templateUrl : 'views/subsidiaries.html',
            controller : 'subsidiaryController'
        })
        .state('companies', {
            url :'/subsidiaries/:id',
            templateUrl : 'views/subsidiaries-details.html',
            controller : 'detailsController'
        })
}])
