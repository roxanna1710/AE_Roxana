'use strict'
let ctrl = angular.module('subsidiaryModule', ['ui.router'])

const SERVER = 'https://project-beldimanroxana.c9users.io'

ctrl.controller('subsidiaryController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    let $constructor = () => {
        $http.get(SERVER + '/subsidiaries')
            .then((response) => {
                $scope.subsidiaries = response.data
            })
            .catch((error) => console.log(error))
    }

    $scope.addSubsidiary = (subsidiary) => {
        $http.post(SERVER + '/subsidiaries', subsidiary)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $scope.deleteSubsidiary= (subsidiary) => {
        $http.delete(SERVER + '/subsidiaries/' + subsidiary.id)
            .then((response) => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $scope.selected = {}
    $scope.restoreCopy = {}

    $scope.getTemplate = (subsidiary) => {
        if (subsidiary.id == $scope.selected.id) {
            return 'edit'
        }
        return 'display'
    }

    $scope.editSubsidiary = (subsidiary) => {
        $scope.selected = angular.copy(subsidiary)
        $scope.restoreCopy = angular.copy(subsidiary)
    }

    $scope.cancelEditing = (subsidiary) => {
        $scope.selected = {}
        subsidiary = angular.copy($scope.restoreCopy)
    }

    $scope.linkCompany = (subsidiary) =>{
        
        $http.get(SERVER +'/subsidiaries/'+ subsidiary.id +'/companies').then(() => {
                $state.go('companies', {id:subsidiary.id}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    } 
    
    $scope.saveSubsidiary = (subsidiary) => {
        $http.put(SERVER + '/subsidiaries/' + subsidiary.id, subsidiary)
            .then(() => {
                $state.go($state.current, {}, {
                    reload: true
                })
            })
            .catch((error) => console.log(error))
    }

    $constructor()

}])
