'use strict';
var angularObj = {
    app: null,
    initAngular: function (api, freshState) {
        angularObj.app = angular.module('myAplicacion', ['ngMaterial', 'md.data.table']);

        angularObj.app.controller('accesoDatosController', ['$scope', '$http', '$mdSelect', function ($scope, $http, $mdSelect) {
            $scope.selected = [];
            $scope.resultReporteFechas = [];
            $scope.deviceId = [];
            $scope.listaIds = [];
            $scope.dispositivoIngresado = [];
            $scope.dispositivoIngresadoInput = document.getElementById("dispositivoIngresado");

            $scope.Data = {
                start: new Date(),
                end: new Date()

            };

            api.call("Get", {
                typeName: "Device"
            }, function (result) {
                $scope.lstDeviceGeotab = result;
                $scope.lstDeviceGeotab.forEach(function (device) {
                    $scope.lstDevice.id = device;
                    //console.log(device);
                }); //console.log(device);
            }, function (error) {
                console.log(error.message);
            });

            // funcion que permite ingresar texto en el search 
            $scope.updateSearch = function updateSearch(e) {
                e.stopPropagation();
            };

            $scope.btnImprimir = function () {
                if ($scope.resultReporteFechas.length === 0) {
                    swal(
                        '',
                        'No hay datos que descargar',
                        "error",
                    )
                    console.log("No hay datos que descargar");
                } else
                if ($scope.resultReporteFechas.length > 0) {
                    $("#fechaInstalacion").table2excel({
                        filename: "AuditoríadeRegistros_Fechas"
                    });
                }
            }

            $scope.vehiculosReport1 = function () {

                if ($scope.dispositivoIngresado.length === 0) {
                    swal({
                        type: 'error',
                        text: 'Debes ingresar el deviceId para continuar !!.'
                    });
                } else
                if ($scope.dispositivoIngresado.length > 0) {
                    swal({
                        imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                        timer: 5000,
                        showConfirmButton: false,
                        background: 'rgba(100,100,100,0)'
                    });
                    console.log({
                        dispositivoIngresado: $scope.dispositivoIngresado,
                        start: moment($scope.Data.start).format('MM-DD-YYYY'),
                        end: moment($scope.Data.end).format('MM-DD-YYYY')
                    });
                    return;
                    var conAjax = $http.post("", JSON.stringify({
                        dispositivoIngresado: $scope.dispositivoIngresado,
                        start: moment($scope.Data.start).format('MM-DD-YYYY'),
                        end: moment($scope.Data.end).format('MM-DD-YYYY')
                    }), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        $scope.resultConsultaVehiculos = response.data;
                        console.log(response);
                        if ($scope.resultConsultaVehiculos.length === 0) {
                            swal({
                                type: 'error',
                                text: 'No exixten registros en el rango de fechas seleccionado.'
                            });
                        }
                    }, function errorCallback(response) {
                        console.log(response);
                    });
                }
            }
            $scope.vehiculosReport = function () {
                if ($scope.deviceId.value === $scope.deviceId.value) {
                    swal({
                        imageUrl: 'https://rawgit.com/MayraDelgado/reportes/master/app/img/cargando5.gif',
                        timer: 5000,
                        showConfirmButton: false,
                        background: 'rgba(100, 100, 100, 0)'
                    });
                    console.log({
                        start: moment($scope.Data.start).format('MM-DD-YYYY'),
                        end: moment($scope.Data.end).format('MM-DD-YYYY'),

                    });
                    return;
                    var conAjax = $http.post("", JSON.stringify({
                        start: moment($scope.Data.start).format('MM-DD-YYYY'),
                        end: moment($scope.Data.end).format('MM-DD-YYYY'),
                        devices: $scope.listaIds
                    }), {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function successCallback(response) {
                        $scope.resultConsultaVehiculos = response.data;
                        console.log(response);
                        if ($scope.resultConsultaVehiculos.length === 0) {
                            swal({
                                type: 'error',
                                text: 'No existen registros en el rango de fechas seleccionado'
                            });
                        }
                    }, function errorCallback(response) {
                        console.error(response);
                    });
                }
            }
        }]);
    }
}