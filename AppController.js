(function () {
  angular.module('app').controller('AppController', function () {
    var vm = this;

    vm.indicadores = {};
    vm.indicadores.selic = 0.0825;
    vm.indicadores.cdi = 0.0814;
    vm.indicadores.ipca = 0.0019;
    vm.indicadores.tr = 0.0000;
    vm.indicadores.poupanca = ((vm.indicadores.selic * 0.7) + vm.indicadores.tr) / 12;

    vm.form = {};
    vm.form.valorExistente = 0;
    vm.form.deposito = 200;
    vm.form.meses = 360;
    vm.form.juros = vm.indicadores.poupanca;
    vm.form.inflacao = vm.indicadores.ipca;
    vm.form.imposto = 0.15;

    /* Formula para juros compostos
      ex: CDB (10%) com 120%
      ((1+(i/100))^(1/12))-1
      ((1+(12/100))^(1/12) )-1
      (1,12^0,08)-1 = 0,0095. Multiplique este resultado por 100 e dará a taxa equivalente (0,95%).
    */


    vm.calcular = calcular;

    start();

    function start() {
      calcular();
    }

    function calcular() {
      vm.form.jurosEfetivo = (1 + vm.form.juros * (1 - vm.form.imposto)) / (1 + vm.form.inflacao) - 1;
      vm.form.resultado = -FV(vm.form.jurosEfetivo, vm.form.meses, vm.form.deposito, vm.form.valorExistente, 0);
    }

    function FV(jurosEfetivo, quantiaMeses, depositoMensal, valorExistente, type) {
      var pow = Math.pow(1 + jurosEfetivo, quantiaMeses),
        fv;
      if (jurosEfetivo) {
        fv = (depositoMensal * (1 + jurosEfetivo * type) * (1 - pow) / jurosEfetivo) - valorExistente * pow;
      } else {
        fv = -1 * (valorExistente + depositoMensal * quantiaMeses);
      }
      return fv.toFixed(2);
    }
  });
}());
