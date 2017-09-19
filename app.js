(function() {
    "use strict";

    angular.module('app', ['ui.utils.masks', 'idf.br-filters'])
    .controller("AppController", AppController);

    function AppController() {
        var vm = this;
        vm.form = {};
        vm.form.valorExistente = 10000;
        vm.form.deposito = 200;
        vm.form.meses = 360;
        vm.form.juros = 0.013;
        vm.form.inflacao = 0.0040;
        vm.form.imposto = 0.15;

        vm.calcular = calcular;

        start();

        function start() {
            calcular();
        }

        function calcular() {
            vm.form.jurosEfetivo = (1 + vm.form.juros * (1 - vm.form.imposto)) / (1 + vm.form.inflacao) - 1;
            vm.form.resultado = -FV(vm.form.jurosEfetivo, vm.form.meses, vm.form.deposito, vm.form.valorExistente, 0);
        }

        //vm.form.jurosEfetivo, vm.form.meses, vm.form.deposito, vm.form.valorExistente
        function FV(rate, nper, pmt, pv, type) {
          var pow = Math.pow(1 + rate, nper),
             fv;
          if (rate) {
           fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;
          } else {
           fv = -1 * (pv + pmt * nper);
          }
          return fv.toFixed(2);
        }
    }
})();