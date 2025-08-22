sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "zhxreporteoperaciones/zhxreporteoperaciones/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageToast"
],
function (Controller,formatter,Spreadsheet, MessageToast) {
    "use strict";

    return Controller.extend("zhxreporteoperaciones.zhxreporteoperaciones.controller.Principal", {

        formatter: formatter,

        onInit: function () {

            //document.title = "Reporte Personal Activo"

            this.cantRegistros = 0;
            this.mostarCantRegistros = this.byId("titleTable");

        },
        
        //Boton "GO" -> Busqueda con Filtros
        onSearch: function () {
            
            var oGlobalBusyDialog = new sap.m.BusyDialog();
            var aFilters = new Array();
            var that = this;
            var oModel = this.getOwnerComponent().getModel();


            //const sFiltro_pernr = this.byId("f_pernr").getValue();
            const sFiltro_rut = this.byId("f_rut").getValue();
            const sFiltro_tcontrato = this.byId("f_tipocontrato").getSelectedKey();
            const sFiltro_tprofe = this.byId("f_tipoprofesional").getSelectedKey();

            /*if(sFiltro_pernr){
                aFilters.push(new sap.ui.model.Filter("Pernr",sap.ui.model.FilterOperator.EQ,sFiltro_pernr))
            }*/
            if(sFiltro_rut){
                aFilters.push(new sap.ui.model.Filter("Rut",sap.ui.model.FilterOperator.EQ,sFiltro_rut))
            }
            if(sFiltro_tcontrato){
                aFilters.push(new sap.ui.model.Filter("CodContrato",sap.ui.model.FilterOperator.EQ,sFiltro_tcontrato))
            }
            if(sFiltro_tprofe){
                aFilters.push(new sap.ui.model.Filter("CodProfesional",sap.ui.model.FilterOperator.EQ,sFiltro_tprofe))
            }

            //sfilter = new sap.ui.model.Filter("N°Per",sap.ui.model.FilterOperator.EQ,sValor);
            //aFilters.push(sfilter);

            oGlobalBusyDialog.open();

            oModel.read("/ReporteSet",{
                filters: aFilters,
                async: false,
                success: function (oData, response){
                    that.Resultado = new sap.ui.model.json.JSONModel(oData);
                    //console.log(that.Resultado.oData.results);
                    that.cantRegistros = that.Resultado.oData.results.length;
                    that.mostarCantRegistros.setText("N° Registros (" + that.cantRegistros + ")");
                    that.getView().setModel(that.Resultado,"Listado");
                    oGlobalBusyDialog.close()
                },
                error: function (response){
                    oGlobalBusyDialog.close();
                    return;
                }
            });
        },
        //Boton "Exportar" -> Exportar a Excel
        onExcel: function () {
            const oModel = this.getView().getModel();
          
            oModel.read("/ReporteSet", {
                success: function (oData) {
                    const aData = oData.results;
                    const aCols = this.createColumnConfig();
            
                    const oSettings = {
                    workbook: { columns: aCols },
                    dataSource: aData,
                    fileName: "UAndes - Reporte Personal Activo.xlsx",
                    worker: false
                    };
            
                    new Spreadsheet(oSettings).build().then(() => MessageToast.show("Exportación completa"));
                }.bind(this),

                error: function () {
                    MessageToast.show("Error al exportar.");
                }
            });
        },

        //Definir Campos de Excel a Exportar
        createColumnConfig: function () {
            return [
                {
                    label: "N° Persona",
                    property: "Pernr",
                    type: "string"
                },
                {
                    label: "Rut",
                    property: "Rut",
                    type: "string"
                },
                {
                    label: "Nombre",
                    property: "Nombre",
                    type: "string"
                },
                {
                    label: "Correo",
                    property: "Correo",
                    type: "string"
                },
                {
                    label: "Tipo Contrato",
                    property: "TipoContrato",
                    type: "string"
                },
                {
                    label: "F. Contratación",
                    property: "FechaContratacion",
                    type: "date",
                    inputFormat: "dd-MM-yyyy"
                },
                {
                    label: "Posicion",
                    property: "Posicion",
                    type: "string"
                },
                {
                    label: "Hrs. Sem.",
                    property: "HorasSem",
                    type: "double"
                },
                {
                    label: "Depto. Principal",
                    property: "Departamento",
                    type: "string"
                },
                {
                    label: "Division",
                    property: "Division",
                    type: "string"
                },
                {
                    label: "Uni. Negocio",
                    property: "UnidadNegocio",
                    type: "string"
                },
                {
                    label: "Tipo Profesional",
                    property: "TipoProfesional",
                    type: "string"
                },
                {
                    label: "Antiguedad",
                    property: "Antiguedad",
                    type: "string"
                }
            ];
        },

        reiniciarFiltros: function () {

            this.byId("f_rut").setValue("");
            this.byId("f_tipocontrato").setValue("");
            this.byId("f_tipoprofesional").setValue("");

            var oGlobalBusyDialog = new sap.m.BusyDialog();
            var that = this;
            var oModel = this.getOwnerComponent().getModel();

            oModel.read("/ReporteSet",{
                async: false,
                success: function (oData, response){
                    that.Resultado = new sap.ui.model.json.JSONModel(oData);
                    that.cantRegistros = that.Resultado.oData.results.length;
                    that.mostarCantRegistros.setText("N° Registros (" + that.cantRegistros + ")");
                    that.getView().setModel(that.Resultado,"Listado");
                    oGlobalBusyDialog.close()
                },
                error: function (response){
                    oGlobalBusyDialog.close();
                    return;
                }
            });
        }
    });
});