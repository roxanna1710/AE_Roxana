'use strict'
angular.module('subsidiaryModule')
  .controller('detailsController', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {
    const SERVER = 'https://project-beldimanroxana.c9users.io'

    let $constructor = () => {
      $http.get(SERVER + '/subsidiaries/' + $stateParams.id )
        .then((response) => {
          $scope.subsidiary = response.data
          return $http.get(SERVER + '/subsidiaries/' + $stateParams.id + '/companies')
        })
        .then((response) => {
          $scope.companies = response.data
          console.log("Companies: " +  $scope.companies)
        })
        .catch((error) => console.log(error))
    }

    $scope.addCompany = (company) => {
      console.log(company)
      $http.post(SERVER + '/subsidiaries/' + $stateParams.id + '/companies', company)
        .then((response) => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }

    $scope.deleteCompany = (company) => {
      $http.delete(SERVER + '/subsidiaries/' + $stateParams.id + '/companies/' + company.id)
        .then((response) => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }

    $scope.selected = {}

    $scope.getTemplate = (company) => {
      if (company.id == $scope.selected.id) {
        return 'edit'
      }
      return 'display'
    }

    $scope.editCompany = (company) => {
      $scope.selected = angular.copy(company)
    }

    $scope.cancelEditing = () => {
      $scope.selected = {}
    }

    $scope.saveCompany = (company) => {
      $http.put(SERVER + '/subsidiaries/' + $stateParams.id + '/companies/' + company.id, company)
        .then(() => {
          $state.go($state.current, {}, {
            reload: true
          })
        })
        .catch((error) => console.log(error))
    }


    $constructor()
  }])
