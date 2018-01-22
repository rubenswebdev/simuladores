(function () {
  angular.module('app').controller('AppController', function () {
    var vm = this;

    vm.addImposto = true;

    vm.indicadores = {};
    vm.indicadores.selic = 0.0700; //anual
    vm.indicadores.cdi = 0.0689; //anual
    vm.indicadores.ipca = 0.0221; //mensal
    vm.indicadores.tr = 0.0000; //mensal atualizado diariamente

    vm.indicadores.poupanca = Math.round((converterMensal(vm.indicadores.selic * 0.7) + vm.indicadores.tr) * 100 * 100) / 100 / 100;
    //vm.indicadores.poupanca = converterMensal(vm.indicadores.selic * 0.7) + vm.indicadores.tr;

    vm.form = {};
    vm.form.valorExistente = 0;
    vm.form.deposito = 200;
    vm.form.meses = 360;

    //vm.form.juros = vm.indicadores.poupanca;
    vm.form.juros = Math.round(converterMensal(vm.indicadores.selic) * 100 * 100) / 100 / 100;
    vm.form.inflacao = vm.indicadores.ipca;
    vm.form.imposto = 0;

    vm.converterMensal = converterMensal;
    vm.calcularCDI = calcularCDI;

    function calcularCDI() {
      vm.form.porcetagemCDI = Math.round(converterMensal(vm.indicadores.selic * vm.form.jurosCDI) * 100 * 100) / 100 / 100
    }

    function converterMensal(juros) {
      return (Math.pow((1+((juros * 100)/100)), (1/12))-1);
    }

    function arredonda(valor) {
      return Math.round(converterMensal(valor) * 100 * 100) / 100 / 100
    }

    /*
      SELIC 8,25
      ((1+(8.25/100))^(1/12))-1
    */

    /*
      Poupança 70% do selic 8,25%
      70 / 100 = 0,7%
      8,25 * 0,7 = 5,775
      = ((1+(5.775/100))^(1/12))-1 = 0.0046896296 * 100 = 0.4689629606 a.m
    */

    /* Formula para juros compostos
      ex: CDB (7,39%) com 120%
      ((1+(i/100))^(1/12))-1
      ((1+(120/100))^(1/12) )-1
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
      vm.form.anos = vm.form.meses / 12;
      vm.form.imposto = 0;

      if (vm.addImposto && vm.form.meses <= 6) {
        vm.form.imposto = 0.225;
      }

      if (vm.addImposto && vm.form.meses > 6 && vm.form.meses <= 12) {
        vm.form.imposto = 0.20;
      }

      if (vm.addImposto && vm.form.meses > 12 && vm.form.meses <= 24) {
        vm.form.imposto = 0.175;
      }

      if (vm.addImposto && vm.form.meses > 24) {
        vm.form.imposto = 0.15;
      }
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
