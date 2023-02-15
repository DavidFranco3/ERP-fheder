// Rutas generales del sistema
import Dashboard from "../page/Dashboard";
import Tiquets from "../page/Tiquets";
import RecepcionMaterialInsumos from "../page/RecepcionMaterialInsumos";
import ProgramaProduccion from "../page/ProgramaProduccion";
import Compras from "../page/Compras";
import Embarque from "../page/Embarque";
import Facturacion from "../page/Facturacion";
import Logistica from "../page/Logistica";
import Planeacion from "../page/Planeacion";
import Produccion from "../page/Produccion";
import Ventas from "../page/Ventas";
import Usuarios from "../page/Usuarios";
import Clientes from "../page/Clientes";
import Proveedores from "../page/Proveedores";
import RazonesSociales from "../page/RazonesSociales";
import UnidadesMedida from "../page/UnidadesMedida";
import Departamentos from "../page/Departamentos";
import MateriasPrimas from "../page/MateriasPrimas";
import ClasificacionMateriales from "../page/ClasificacionMateriales";
import ClasificacionMaquinaria from "../page/ClasificacionMaquinaria";
import Cotizaciones from "../page/Cotizaciones";
import EvaluacionProveedores from "../page/EvaluacionProveedores";
import Requisiciones from "../page/Requisiciones";
import Logs from "../page/Logs";
import Calidad from "../page/Calidad";
import Remisiones from "../page/Remisiones";
import Rechazos from "../page/Rechazos";
import AcusesRecibo from "../page/AcusesRecibo";
import Devoluciones from "../page/Devoluciones";
import MatrizProductos from "../page/MatrizProductos";
import Tracking from "../page/Tracking";
import StatusMaterial from "../page/StatusMaterial";
import EtiquetaPrimeraPieza from "../page/EtiquetaPrimeraPieza";
import InspeccionPieza from "../page/InspeccionMaterial";
import AlertasCalidad from "../page/AlertasCalidad";
import NoConformidad from "../page/NoConformidad";
import LiberacionProductoProceso from "../page/LiberacionProductoProceso";
import FichaTecnica from "../page/FichaTecnica";
import CertificadosCalidad from "../page/CertificadosCalidad";
import AsignacionPedido from "../page/AsignacionPedido";
import Mes from "../page/Mes";
import Semana from "../page/Semana";
import Maquinaria from "../page/Maquinaria";
import Maquinas from "../page/Maquinas";
import ReporteProduccion from "../page/ReporteProduccion";
import IdentificacionPT from "../page/IdentificacionPT";
import MaterialMolido from "../page/MaterialMolido";
import CarpetasProceso from "../page/CarpetasProceso";
import ControlParametrosMaquina from "../page/ControlParametrosMaquina";
import Mantenimiento from "../page/Mantenimiento";
import EtiquetasMoldes from "../page/EtiquetasMoldes";
import InventarioMaquinas from "../page/InventarioMaquinas";
import InventarioMoldes from "../page/InventarioMoldes";
import MantenimientoPreventivo from "../page/MantenimientoPreventivo";
import EntradaSalidaMoldes from "../page/EntradaSalidaMoldes";
import VerificacionMantenimientos from "../page/VerificacionMantenimientos";
import SolicitudMaterialInsumo from "../page/SolicitudMaterialInsumo";
import RequerimientosPlaneacion from "../page/RequerimientosPlaneacion";
import VentasGastos from "../page/VentasGastos";
import Sucursales from "../page/Sucursales";
import GestionAlmacen from "../page/GestionAlmacen";
import Almacenes from "../page/Almacenes";
import Error404 from "../page/Error404";
import Facturas from "../page/Facturas";
import Notas from "../page/Notas"

// importacion de dashboards
import DashboardVentas from "../components/Dashboards/DashboardVentas";
import DashboardCompras from "../components/Dashboards/DashboardCompras";
import DashboardPlaneacion from "../components/Dashboards/DashboardPlaneacion";
import DashboardProduccion from "../components/Dashboards/DashboardProduccion";
import DashboardCalidad from "../components/Dashboards/DashboardCalidad";
import DashboardMantenimiento from "../components/Dashboards/DashboardMantenimiento";
import DashboardCatalogos from "../components/Dashboards/DashboardCatalogos";
import DashboardConfiguracion from "../components/Dashboards/DashboardConfiguracion";
import DashboardFinanzas from "../components/Dashboards/DashboardFinanzas";

// Importacion de componentes de vista previa de vista PDF
import VistaPrevia from "../components/Ventas/VistaPrevia";

// Rutas para el programa de producción
import RegistraProgramaProduccion from "../components/ProgramaProduccion/Registro";
import ModificaProgramaProduccion from "../components/ProgramaProduccion/Modificacion";
import VistaPreviaProgramaProduccion from "../components/ProgramaProduccion/VistaPreviaProgramaProduccion";

// Rutas para la matriz de productos
import ModificaMatrizProductos from "../components/MatrizProductos/ModificaMatrizProductos";
import RegistraMatrizProductos from "../components/MatrizProductos/RegistraMatrizProductos";
import VistaDetallada from "../components/MatrizProductos/VistaDetallada";

// Rutas para calidad
import RegistraReporte from "../components/Calidad/RegistraReporte";
import ModificaReporte from "../components/Calidad/ModificaReporte";
import VistaPreviaCalidad from "../components/Calidad/VistaPreviaCalidad";

// Rutas para las requisiciones
import RegistraRequisiciones from "../components/Requisiciones/RegistraRequisiciones";
import ModificaRequisiciones from "../components/Requisiciones/ModificaRequisiciones";
import RequisicionPlaneacion from "../components/Requisiciones/RequisicionPlaneacion";
import VistaPreviaRequisiciones from "../components/Requisiciones/VistaPreviaRequisiciones";


// Rutas para las renisiones
import RegistraRemisiones from "../components/Remisiones/RegistraRemisiones";
import ModificaRemisiones from "../components/Remisiones/ModificaRemisiones";

// Rutas para las cotizaciones
import RegistraCotizaciones from "../components/Cotizaciones/RegistraCotizaciones";
import ModificaCotizaciones from "../components/Cotizaciones/ModificaCotizaciones";

// Rutas para los usuarios (colaboradores)
import RegistroUsuarios from "../components/Usuarios/Registro";
import ModificacionUsuarios from "../components/Usuarios/Modificacion";

// Rutas para los clientes
import RegistroClientes from "../components/Clientes/Registro";
import ModificacionClientes from "../components/Clientes/Modificacion";

// Rutas para los proveedores
import RegistroProveedores from "../components/Proveedores/Registro";
import ModificacionProveedores from "../components/Proveedores/Modificacion";

// Rutas para las evaluaciones de proveedores
import RegistroEvaluacionProveedores from "../components/EvaluacionProveedores/RegistraProveedores";
import ModificacionEvaluacionProveedores from "../components/EvaluacionProveedores/ModificaProveedores";
import VistaPreviaEvaluacionProveedores from "../components/EvaluacionProveedores/VistaPreviaEvaluacionProveedores";

// Rutas para las razones sociales
import RegistroRazonSocial from "../components/RazonesSociales/Registro";
import ModificacionRazonSocial from "../components/RazonesSociales/Modificacion";

// Rutas para los tiquets
import RegistroTiquets from "../components/Tiquets/Registro";
import ModificacionTiquets from "../components/Tiquets/Modificacion";

// Rutas para las compras
import RegistroCompras from "../components/Compras/Registro";
import ModificacionCompras from "../components/Compras/Modificacion";
import VistaPreviaCompras from "../components/Compras/VistaPrevia";

// Rutas para el embarque
import RegistroEmbarque from "../components/Embarque/Registro";
import ModificacionEmbarque from "../components/Embarque/Modificacion";

// Rutas para la facturación
import RegistroFactura from "../components/Facturacion/Registro";
import ModificacionFactura from "../components/Facturacion/Modificacion";

// Rutas para la logística
import RegistroLogistica from "../components/Logistica/Registro";
import ModificacionLogistica from "../components/Logistica/Modificacion";

// Rutas para la logística
import RegistroRecepcion from "../components/RecepcionMaterialInsumos/RegistroRecepcion";
import ModificacionRecepcion from "../components/RecepcionMaterialInsumos/ModificaRecepcion";
import VistaPreviaRecepcion from "../components/RecepcionMaterialInsumos/VistaPreviaRecepcion";

// Rutas para planeación
import RegistroPlaneacion from "../components/Planeacion/Registro";
import ModificacionPlaneacion from "../components/Planeacion/Modificacion";

// Rutas para las ventas
import RegistroVentas from "../components/Ventas/Registro";
import ModificacionVentas from "../components/Ventas/Modificacion";
import VistaPreviaVentas from "../components/Ventas/VistaPrevia";

// Rutas para producción
import RegistroProduccion from "../components/Produccion/Registro";
import ModificacionProduccion from "../components/Produccion/Modificacion";
import ProduccionPlaneacion from "../components/Produccion/ProduccionPlaneacion";
import VistaPreviaProduccion from "../components/Produccion/VistaPreviaProduccion";

// Rutas para rechazos
import RegistroRechazos from "../components/Rechazos/RegistraRechazos";
import ModificacionRechazos from "../components/Rechazos/ModificaRechazos";

// Rutas para acuses de recibos
import RegistroAcusesRecibo from "../components/AcusesRecibo/RegistraAcusesRecibo";
import ModificacionAcusesRecibo from "../components/AcusesRecibo/ModificaAcusesRecibo";

// Rutas para devoluciones
import RegistroDevoluciones from "../components/Devoluciones/RegistraDevoluciones";

// Rutas para status de material
import RegistroStatusMaterial from "../components/StatusMaterial/RegistraStatus";
import ModificaStatusMaterial from "../components/StatusMaterial/ModificaStatus";
import VistaPreviaStatus from "../components/StatusMaterial/VistaPreviaStatus";

// Rutas para la inspeccion de material
import RegistroInspeccionPieza from "../components/InspeccionMaterial/RegistraInspeccionMaterial";
import ModificaInspeccionPieza from "../components/InspeccionMaterial/ModificaInspeccionMaterial";
import VistaPreviaInspeccion from "../components/InspeccionMaterial/VistaPreviaInspeccion";

// Rutas para la alerta de calidad
import RegistroAlertasCalidad from "../components/AlertasCalidad/RegistraAlertasCalidad";
import ModificaAlertasCalidad from "../components/AlertasCalidad/ModificaAlertasCalidad";
import VistaPreviaAlertasCalidad from "../components/AlertasCalidad/VistaPreviaAlertasCalidad";

// Rutas para la No Conformidad
import RegistroNoConformidad from "../components/NoConformidad/RegistraNoConformidad";
import ModificaNoConformidad from "../components/NoConformidad/ModificaNoConformidad";
import VistaPreviaNoConformidad from "../components/NoConformidad/VistaPreviaNoConformidad";

// Rutas para la Liberación de productos y procesos
import RegistroLiberacionProductoProceso from "../components/LiberacionProductoProceso/RegistraLiberacionProductoProceso";
import ModificaLiberacionProductoProceso from "../components/LiberacionProductoProceso/ModificaLiberacionProductoProceso";
import VistaPreviaLiberacionProducto from "../components/LiberacionProductoProceso/VistaPreviaLiberacionProducto";

// Rutas para la ficha tecnica
import RegistroFichaTecnica from "../components/FichaTecnica/RegistraFichaTecnica";
import ModificaFichaTecnica from "../components/FichaTecnica/ModificaFichaTecnica";
import VistaPreviaFichasTecnicas from "../components/FichaTecnica/VistaPreviaFichasTecnicas";

// Rutas para el certificado de calidad
import RegistroCertificadoCalidad from "../components/CertificadosCalidad/RegistraCertificado";
import ModificaCertificadoCalidad from "../components/CertificadosCalidad/ModificaCertificado";
import VistaPreviaCertificadosCalidad from "../components/CertificadosCalidad/VistaPreviaCertificadosCalidad";

// Rutas para el reporte de produccion
import RegistroReporteProduccion from "../components/ReporteProduccion/RegistroReporteProduccion";
import ModificaReporteProduccion from "../components/ReporteProduccion/ModificaReporteProduccion";
import VistaPreviaReporte from "../components/ReporteProduccion/VistaPreviaReporte";

// Rutas para las carpetas de proceso
import RegistroCarpetasProceso from "../components/CarpetasProceso/RegistroCarpetasProceso";

// Rutas para el control de parametros de maquina
import RegistroControlParametrosMaquina from "../components/ControlParametrosMaquina/RegistroParametrosMaquina";

// Rutas para el Mantenimiento
import RegistroMantenimiento from "../components/Mantenimiento/RegistraMantenimiento";

// Rutas para Registro de entrada y salida de moldes
import RegistroEntradaSalidaMoldes from "../components/EntradaSalidaMoldes/RegistraEntradaSalidaMolde";

// Rutas para Registro de maquinas y mantenimientos
import RegistroMaquinasMantenimientos from "../components/VerificacionMantenimientos/RegistroMaquinasMantenimientos";
import RegistroVerificacionMantenimientos from "../components/VerificacionMantenimientos/RegistroVerificacionMantenimientos";

// Rutas para Registro de entrada y salida de moldes
import RegistraSolicitudMaterialInsumo from "../components/SolicitudMaterialInsumo/RegistraSolicitudMaterialInsumo";

// Rutas para Registro de entrada y salida de moldes
import RegistraRequerimientosPlaneacion from "../components/RequerimientosPlaneacion/Registro";
import ModificaRequerimientosPlaneacion from "../components/RequerimientosPlaneacion/Modificacion";
import VistaPreviaPlaneacion from "../components/RequerimientosPlaneacion/VistaPreviaPlaneacion";

// Rutas para cuentas por cobrar
import FacturasOV from "../components/Facturas/FacturasOV";
import RegistroFacturas from "../components/Facturas/RegistroFacturas";
import ModificaFacturas from "../components/Facturas/ModificaFacturas";
import VistaPreviaFactura from "../components/Facturas/VistaPreviaFactura";

// Rutas para etiqueta de identificación de PT
import VistaPreviaIdentificacionPT from "../components/IdentificacionPT/VistaPreviaIdentificacionPT";

// Rutas para material molido
import VistaPreviaMaterialMolido from "../components/MaterialMolido/VistaPreviaMaterialMolido";

// Rutas para etiquetas de primera pieza
import VistaPreviaPrimeraPieza from "../components/EtiquetaPrimeraPieza/VistaPreviaPrimeraPieza";

// Rutas para notas
import RegistroNota from "../components/Notas/Registro";
import ModificacionNotas from "../components/Notas/Modificacion";
import VistaPreviaNota from "../components/Notas/VistaPrevia";

export default [
    {
        path: "/Almacenes",
        page: Almacenes
    },
    {
        path: "/RegistroNota",
        page: RegistroNota
    },
    {
        path: "/ModificacionNotas/:id",
        page: ModificacionNotas
    },
    {
        path: "/VistaPreviaNotas/:id",
        page: VistaPreviaNota
    },
    {
        path: "/RegistraRequerimientosPlaneacion",
        page: RegistraRequerimientosPlaneacion
    },
    {
        path: "/ModificaRequerimientosPlaneacion/:id",
        page: ModificaRequerimientosPlaneacion
    },
    {
        path: "/VistaPreviaPlaneacion/:id",
        page: VistaPreviaPlaneacion
    },
    {
        path: "/VistaPreviaIdentificacionPT/:id",
        page: VistaPreviaIdentificacionPT
    },
    {
        path: "/VistaPreviaMaterialMolido/:id",
        page: VistaPreviaMaterialMolido
    },
    {
        path: "/VistaPreviaPrimeraPieza/:id",
        page: VistaPreviaPrimeraPieza
    },
    {
        path: "/FacturasOV/:ordenVenta",
        page: FacturasOV
    },
    {
        path: "/RegistroFacturas",
        page: RegistroFacturas
    },
    {
        path: "/ModificaFacturas/:id",
        page: ModificaFacturas
    },
    {
        path: "/VistaPreviaFactura/:id",
        page: VistaPreviaFactura
    },
    {
        path: "/RegistraSolicitudMaterialInsumo",
        page: RegistraSolicitudMaterialInsumo
    },
    {
        path: "/RegistraInspeccionPieza",
        page: RegistroInspeccionPieza
    },
    {
        path: "/ModificaInspeccionPieza/:id",
        page: ModificaInspeccionPieza
    },
    {
        path: "/VistaPreviaInspeccion/:id",
        page: VistaPreviaInspeccion
    },
    {
        path: "/RegistraDevoluciones",
        page: RegistroDevoluciones
    },
    {
        path: "/RegistroStatusMaterial",
        page: RegistroStatusMaterial
    },
    {
        path: "/ModificaStatusMaterial/:id",
        page: ModificaStatusMaterial
    },
    {
        path: "/VistaPreviaStatus/:id",
        page: VistaPreviaStatus
    },
    {
        path: "/RegistraAcusesRecibo",
        page: RegistroAcusesRecibo
    },
    {
        path: "/RegistroCertificadoCalidad",
        page: RegistroCertificadoCalidad
    },
    {
        path: "/ModificaCertificadoCalidad/:id",
        page: ModificaCertificadoCalidad
    },
    {
        path: "/VistaPreviaCertificadosCalidad/:id",
        page: VistaPreviaCertificadosCalidad
    },
    {
        path: "/RegistroMaquinasMantenimientos",
        page: RegistroMaquinasMantenimientos
    },
    {
        path: "/RegistroVerificacionMantenimientos",
        page: RegistroVerificacionMantenimientos
    },
    {
        path: "/ModificaAcusesRecibo",
        page: ModificacionAcusesRecibo
    }, 
    {
        path: "/RegistraRechazos",
        page: RegistroRechazos
    },
    {
        path: "/ModificaRechazos",
        page: ModificacionRechazos
    },    
    {
        path: "/RegistroCotizaciones",
        page: RegistraCotizaciones
    },
    {
        path: "/Detalles_matriz_producto/:producto",
        page: VistaDetallada
    },
    {
        path: "/ModificaCotizacion/:id",
        page: ModificaCotizaciones
    },
    {
        path: "/Registra-Matriz-Productos",
        page: RegistraMatrizProductos
    },
    {
        path: "/Modifica-Matriz-Productos/:producto",
        page: ModificaMatrizProductos
    },
    {
        path: "/RegistroUsuarios",
        page: RegistroUsuarios
    },
    {
        path: "/RegistroLiberacionProductoProceso",
        page: RegistroLiberacionProductoProceso
    },
    {
        path: "/ModificaLiberacionProductoProceso/:id",
        page: ModificaLiberacionProductoProceso
    },
    {
        path: "/VistaPreviaLiberacionProducto/:id",
        page: VistaPreviaLiberacionProducto
    },
    {
        path: "/ModificacionUsuarios/:id",
        page: ModificacionUsuarios
    },
    {
        path: "/ModificacionUsuarios",
        page: ModificacionUsuarios
    },
    {
        path: "/RegistroClientes",
        page: RegistroClientes
    },
    {
        path: "/RegistroProveedores",
        page: RegistroProveedores
    },
    {
        path: "/RegistroEvaluacionProveedores",
        page: RegistroEvaluacionProveedores
    },
    {
        path: "/RegistroRazonesSociales",
        page: RegistroRazonSocial
    },
    {
        path: "/RegistroNoConformidad",
        page: RegistroNoConformidad
    },
    {
        path: "/ModificaNoConformidad/:id",
        page: ModificaNoConformidad
    },
    {
        path: "/VistaPreviaNoConformidad/:id",
        page: VistaPreviaNoConformidad
    },
    {
        path: "/ModificacionClientes/:id",
        page: ModificacionClientes
    },
    {
        path: "/ModificacionEvaluacionProveedores/:id",
        page: ModificacionEvaluacionProveedores
    },
    {
        path: "/VistaPreviaEvaluacionProveedores/:id",
        page: VistaPreviaEvaluacionProveedores
    },
    {
        path: "/ModificacionProveedores/:id",
        page: ModificacionProveedores
    },
    {
        path: "/ModificacionRazonesSociales/:id",
        page: ModificacionRazonSocial
    },
    {
        path: "/ModificacionClientes",
        page: ModificacionClientes
    },
    {
        path: "/RegistroTiquets",
        page: RegistroTiquets
    },
    {
        path: "/RegistroProgramaProduccion/:semana",
        page: RegistraProgramaProduccion
    },
    {
        path: "/ModificaProgramaProduccion/:id",
        page: ModificaProgramaProduccion
    },
    {
        path: "/VistaPreviaProgramaProduccion/:id",
        page: VistaPreviaProgramaProduccion
    },
    {
        path: "/ModificacionTiquets",
        page: ModificacionTiquets
    },
    {
        path: "/RegistroEntradaSalidaMoldes",
        page: RegistroEntradaSalidaMoldes
    },
    {
        path: "/RegistroCarpetasProceso",
        page: RegistroCarpetasProceso
    },
    {
        path: "/RegistroReporteProduccion",
        page: RegistroReporteProduccion
    },
    {
        path: "/ModificaReporteProduccion/:id",
        page: ModificaReporteProduccion
    },
    {
        path: "/VistaPreviaReporte/:id",
        page: VistaPreviaReporte
    },
    {
        path: "/RegistroCompras",
        page: RegistroCompras
    },
    {
        path: "/ModificacionCompras/:folio",
        page: ModificacionCompras
    },
    {
        path: "/VistaPreviaCompras/:folio",
        page: VistaPreviaCompras
    },
    {
        path: "/RegistroEmbarque",
        page: RegistroEmbarque
    },
    {
        path: "/ModificacionEmbarque",
        page: ModificacionEmbarque
    },
    {
        path: "/RegistroFactura",
        page: RegistroFactura
    },
    {
        path: "/ModificacionFactura",
        page: ModificacionFactura
    },
    {
        path: "/RegistroLogistica",
        page: RegistroLogistica
    },
    {
        path: "/ModificacionLogistica",
        page: ModificacionLogistica
    },
    {
        path: "/RegistroRecepcion",
        page: RegistroRecepcion
    },
    {
        path: "/ModificaRecepcion/:id",
        page: ModificacionRecepcion
    },
    {
        path: "/VistaPreviaRecepcion/:id",
        page: VistaPreviaRecepcion
    },
    {
        path: "/RegistroPlaneacion",
        page: RegistroPlaneacion
    },
    {
        path: "/ModificacionPlaneacion/:folio",
        page: ModificacionPlaneacion
    },
    {
        path: "/Pedido-de-Venta",
        page: RegistroVentas
    },
    {
        path: "/ModificacionPedido/:folio",
        page: ModificacionVentas
    },
    {
        path: "/VistaPreviaVenta/:folio",
        page: VistaPreviaVentas
    },
    {
        path: "/ModificacionPedido",
        page: ModificacionVentas
    },
    {
        path: "/RegistroProduccion",
        page: RegistroProduccion
    },
    {
        path: "/ModificacionProduccion/:id",
        page: ModificacionProduccion
    },
    {
        path: "/VistaPreviaProduccion/:id",
        page: VistaPreviaProduccion
    },
    {
        path: "/ProduccionPlaneacion/:id",
        page: ProduccionPlaneacion
    },
    {
        path: "/RegistroRequisicion",
        page: RegistraRequisiciones
    },
    {
        path: "/ModificacionRequisicion/:id",
        page: ModificaRequisiciones
    },
    {
        path: "/VistaPreviaRequisiciones/:id",
        page: VistaPreviaRequisiciones
    },
    {
        path: "/RequisicionPlaneacion/:id",
        page: RequisicionPlaneacion
    },
    {
        path: "/RegistroRemision",
        page: RegistraRemisiones
    },
    {
        path: "/Modifica remision",
        page: ModificaRemisiones
    },
    {
        path: "/RegistroReporte",
        page: RegistraReporte
    },
    {
        path: "/ModificacionReporte/:id",
        page: ModificaReporte
    },
    {
        path: "/VistaPreviaReporteCalidad/:id",
        page: VistaPreviaCalidad
    },
    {
        path: "/MatrizProductos",
        page: MatrizProductos
    },
    {
        path: "/AlertasCalidad",
        page: AlertasCalidad
    },
    {
        path: "/Devoluciones",
        page: Devoluciones
    },
    {
        path: "/LiberacionProductoProceso",
        page: LiberacionProductoProceso
    },
    {
        path: "/StatusMaterial",
        page: StatusMaterial
    },
    {
        path: "/UnidadesMedida",
        page: UnidadesMedida
    },
    {
        path: "/Acuses_de_Recibos",
        page: AcusesRecibo
    },
    {
        path: "/Rechazos",
        page: Rechazos
    },
    {
        path: "/Sucursales",
        page: Sucursales
    },
    {
        path: "/FichaTecnica",
        page: FichaTecnica
    },
    {
        path: "/Notas",
        page: Notas
    },
    {
        path: "/NoConformidad",
        page: NoConformidad
    },
    {
        path: "/RegistroAlertasCalidad",
        page: RegistroAlertasCalidad
    },
    {
        path: "/ModificaAlertasCalidad/:id",
        page: ModificaAlertasCalidad
    },
    {
        path: "/VistaPreviaAlertasCalidad/:id",
        page: VistaPreviaAlertasCalidad
    },
    {
        path: "/RegistroFichaTecnica",
        page: RegistroFichaTecnica
    },
    {
        path: "/ModificaFichaTecnica/:id",
        page: ModificaFichaTecnica
    },
    {
        path: "/VistaPreviaFichasTecnicas/:id",
        page: VistaPreviaFichasTecnicas
    },
    {
        path: "/RegistroControlParametrosMaquina",
        page: RegistroControlParametrosMaquina
    },
    {
        path: "/RegistroMantenimiento",
        page: RegistroMantenimiento
    },
    {
        path: "/InspeccionPieza",
        page: InspeccionPieza
    },
    {
        path: "/Remisión",
        page: Remisiones
    },
    {
        path: "/Calidad",
        page: Calidad
    },
    {
        path: "/ClasificacionMateriales",
        page: ClasificacionMateriales
    },
    {
        path: "/ClasificacionMaquinaria",
        page: ClasificacionMaquinaria
    },
    {
        path: "/Logs",
        page: Logs
    },
    {
        path: "/Requisiciones",
        page: Requisiciones
    },
    {
        path: "/EtiquetaPrimeraPieza",
        page: EtiquetaPrimeraPieza
    },
    {
        path: "/EvaluacionProveedores",
        page: EvaluacionProveedores
    },
    {
        path: "/Usuarios",
        page: Usuarios
    },
    {
        path: "/GestionAlmacen",
        page: GestionAlmacen
    },
    {
        path: "/Materiales",
        page: MateriasPrimas
    },
    {
        path: "/Departamentos",
        page: Departamentos
    },
    {
        path: "/VentasGastos",
        page: VentasGastos
    },
    {
        path: "/Clientes",
        page: Clientes
    },
    {
        path: "/Proveedores",
        page: Proveedores
    },
    {
        path: "/RazonesSociales",
        page: RazonesSociales
    },
    {
        path: "/Tracking",
        page: Tracking
    },
    {
        path: "/Compras",
        page: Compras
    },
    {
        path: "/AsignacionPedido",
        page: AsignacionPedido
    },
    {
        path: "/Embarque",
        page: Embarque
    },
    {
        path: "/Facturacion",
        page: Facturacion
    },
    {
        path: "/Logistica",
        page: Logistica
    },
    {
        path: "/ProgramaProduccion/:semana",
        page: ProgramaProduccion
    },
    {
        path: "/CertificadosCalidad",
        page: CertificadosCalidad
    },
    {
        path: "/Planeacion",
        page: Planeacion
    },
    {
        path: "/Cotizaciones",
        page: Cotizaciones
    },
    {
        path: "/Produccion",
        page: Produccion
    },
    {
        path: "/Ventas",
        page: Ventas
    },
    {
        path: "/Tiquets",
        page: Tiquets
    },
    {
        path: "/RecepcionMaterialInsumos",
        page: RecepcionMaterialInsumos
    },
    {
        path: "/Mes",
        page: Mes
    },
    {
        path: "/Semana",
        page: Semana
    },
    {
        path: "/Maquinaria",
        page: Maquinaria
    },
    {
        path: "/Maquinas",
        page: Maquinas
    },
    {
        path: "/ReporteProduccion",
        page: ReporteProduccion
    },
    {
        path: "/IdentificacionPT",
        page: IdentificacionPT
    },
    {
        path: "/MaterialMolido",
        page: MaterialMolido
    },
    {
        path: "/CarpetasProceso",
        page: CarpetasProceso
    },
    {
        path: "/ControlParametrosMaquina",
        page: ControlParametrosMaquina
    },
    {
        path: "/Mantenimiento",
        page: Mantenimiento
    },
    {
        path: "/EtiquetasMoldes",
        page: EtiquetasMoldes
    },
    {
        path: "/InventarioMaquinas",
        page: InventarioMaquinas
    },
    {
        path: "/InventarioMoldes",
        page: InventarioMoldes
    },
    {
        path: "/MantenimientoPreventivo",
        page: MantenimientoPreventivo
    },
    {
        path: "/EntradaSalidaMoldes",
        page: EntradaSalidaMoldes
    },
    {
        path: "/VerificacionMantenimientos",
        page: VerificacionMantenimientos
    },
    {
        path: "/SolicitudMaterialInsumo",
        page: SolicitudMaterialInsumo
    },
    {
        path: "/Facturas",
        page: Facturas
    },
    {
        path: "/DashboardVentas",
        page: DashboardVentas
    },
    {
        path: "/DashboardCompras",
        page: DashboardCompras
    },
    {
        path: "/DashboardPlaneacion",
        page: DashboardPlaneacion
    },
    {
        path: "/DashboardProduccion",
        page: DashboardProduccion
    },
    {
        path: "/DashboardCalidad",
        page: DashboardCalidad
    },
    {
        path: "/DashboardMantenimiento",
        page: DashboardMantenimiento
    },
    {
        path: "/RequerimientosPlaneacion",
        page: RequerimientosPlaneacion
    },
    {
        path: "/DashboardCatalogos",
        page: DashboardCatalogos
    },
    {
        path: "/DashboardConfiguracion",
        page: DashboardConfiguracion
    },
    {
        path: "/DashboardFinanzas",
        page: DashboardFinanzas
    },
    {
        path: "/",
        default: true,
        page: Dashboard
    },
    {
        path: "*",
        page: Error404
    }
]
