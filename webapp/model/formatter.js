sap.ui.define([], function () {
  "use strict";
  return {
    formatDateToDDMMYYYY: function (inputDate) {
      if (!inputDate) return "";

      // Asegurar que es un objeto Date
      var date = new Date(inputDate);

      var day = String(date.getDate()).padStart(2, "0");
      var month = String(date.getMonth() + 1).padStart(2, "0"); // Enero es 0
      var year = date.getFullYear();

      return day + "/" + month + "/" + year;
    },
    calcularAntiguedad: function (inputDate) {
      if (!inputDate) return "";

      var date = new Date(inputDate);
      const today = new Date();

      let years = today.getFullYear() - date.getFullYear();
      let months = today.getMonth() - date.getMonth();
      let days = today.getDate() - date.getDate();

      if (days < 0) {
          months -= 1;
          const mesAnterior = new Date(today.getFullYear(), today.getMonth(), 0);
          days += mesAnterior.getDate();
      }

      if (months< 0) {
          years -= 1;
          months += 12;
      }

      return `${years} años ${months} meses ${days} días ` 
    },

    formatearRutSinPuntos: function (sRut) {
      if (!sRut) return "";
      // elimina todos los puntos
      return sRut.replace(/\./g, ""); 
    }
  };
});
