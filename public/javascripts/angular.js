var modules = ['angularUtils.directives.dirPagination'];
const headers = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: function (data) {
        return $.param(data);
    }
};

var app = angular.module('myApp', modules);
app.controller('myCtrl', function ($scope, $http, $location, $sce) {
    $scope.pagination = {
        current: 1,
        total: 0
    };
    $scope.pageSize = 10;
    $scope.list = []
    $scope.getUsers = function (page = 1) {
        var url = $sce.trustAsResourceUrl("/users/list?page=" + (page - 1));
        $http.get(url, headers).then(function (response) {
            if (response.data.status == true) {
                $scope.list = response.data.data.rows;
                $scope.pagination.total = response.data.data.count;
            } else {
            }
        }, function (x) {
        });
    }
    $scope.userInfo = {};
    $scope.editIndex = null;
    $scope.editUser = function (item) {
        angular.copy(item, $scope.userInfo);
        $scope.editIndex = $scope.list.indexOf(item);
    }
    $scope.createUser = function () {
        $scope.editIndex = null;
        $scope.userInfo = { id: 0 };
    }
    $scope.submitUserInfo = function () {
        if ($scope.userInfo.id > 0 && $scope.userInfo.id != undefined) {
            var url = $sce.trustAsResourceUrl("/users/update");
        } else {
            var url = $sce.trustAsResourceUrl("/users/create");
        }
        $http.post(url, $scope.userInfo, headers).then(function (response) {
            if (response.data.status == true) {
                if ($scope.userInfo.id > 0 && $scope.userInfo.id != undefined) {
                    $scope.list[$scope.editIndex] = $scope.userInfo;
                } else {
                    $scope.list.push(response.data.data);
                    $scope.getUsers($scope.pagination.current);
                }
                $("#myModal").modal('hide');
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                    showConfirmButton: false,
                    timer: 1500,
                    footer: 'Holiday Extras'
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                    footer: 'Holiday Extras'
                })
            }
        }, function (x) {
        });
    }

    $scope.deleteUser = function (item) {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                var url = $sce.trustAsResourceUrl("/users/delete?id=" + item.id);
                $http.delete(url, headers).then(function (response) {
                    if (response.data.status == true) {
                        $scope.list.splice($scope.list.indexOf(item), 1);
                        $scope.getUsers($scope.pagination.current);
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Deleted',
                            text: response.data.message,
                            showConfirmButton: false,
                            timer: 1500,
                            footer: 'Holiday Extras'
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.data.message,
                            footer: 'Holiday Extras'
                        })
                    }
                })
            }
        })
    }
});

