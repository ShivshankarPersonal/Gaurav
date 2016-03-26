var app = angular.module("jetbrains", []);
app.controller("appCtrl", function ($http) {
    var app = this;
    var url = "http://localhost:3000";
    //fetchProducts();
    app.fetchProducts = function () {
        $http.get(url).success(
            function (response) {
                app.products = response;
            }
        );
    }
    app.copyProducts = function () {
        $http.get(url+'/copy').success(
            function (response) {
                app.backupProducts = response;
            }
        );
    }
    app.save = function (newProduct, storeId) {
        $http.post(url + '/add', {name: newProduct, storeId:storeId}).success(function (response) {
            app.fetchProducts
        });
    };
    app.getBackupData = function(){
        $http.get(url+'/getBackupData').success(
            function (response) {
                app.backupProducts = response;
            }
        );
    };
});