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

// importacion de dashboards
import DashboardVentas from "../components/Dashboards/DashboardVentas";
import DashboardCompras from "../components/Dashboards/DashboardCompras";
import DashboardPlaneacion from "../components/Dashboards/DashboardPlaneacion";
import DashboardProduccion from "../components/Dashboards/DashboardProduccion";
import DashboardCalidad from "../components/Dashboards/DashboardCalidad";
import DashboardMantenimiento from "../components/Dashboards/DashboardMantenimiento";
import DashboardCatalogos from "../components/Dashboards/DashboardCatalogos";
import DashboardConfiguracion from "../components/Dashboards/DashboardConfiguracion";

// Importacion de componentes de vista previa de vista PDF
import VistaPrevia from "../components/Ventas/VistaPrevia";

// Rutas para el programa de producción
import RegistraProgramaProduccion from "../components/ProgramaProduccion/Registro";
import ModificaProgramaProduccion from "../components/ProgramaProduccion/Modificacion";

// Rutas para la matriz de productos
import ModificaMatrizProductos from "../components/MatrizProductos/ModificaMatrizProductos";
import RegistraMatrizProductos from "../components/MatrizProductos/RegistraMatrizProductos";
import VistaDetallada from "../components/MatrizProductos/VistaDetallada";

// Rutas para calidad
import RegistraReporte from "../components/Calidad/RegistraReporte";
import ModificaReporte from "../components/Calidad/ModificaReporte";

// Rutas para las requisiciones
import RegistraRequisiciones from "../components/Requisiciones/RegistraRequisiciones";
import ModificaRequisiciones from "../components/Requisiciones/ModificaRequisiciones";
import RequisicionesPlaneacion from "../components/Requisiciones/RequisicionPlaneacion";

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

// Rutas para las razones sociales
import RegistroRazonSocial from "../components/RazonesSociales/Registro";
import ModificacionRazonSocial from "../components/RazonesSociales/Modificacion";

// Rutas para los tiquets
import RegistroTiquets from "../components/Tiquets/Registro";
import ModificacionTiquets from "../components/Tiquets/Modificacion";

// Rutas para las compras
import RegistroCompras from "../components/Compras/Registro";
import ModificacionCompras from "../components/Compras/Modificacion";

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

// Rutas para planeación
import RegistroPlaneacion from "../components/Planeacion/Registro";
import ModificacionPlaneacion from "../components/Planeacion/Modificacion";

// Rutas para las ventas
import RegistroVentas from "../components/Ventas/Registro";
import ModificacionVentas from "../components/Ventas/Modificacion";

// Rutas para producción
import RegistroProduccion from "../components/Produccion/Registro";
import ModificacionProduccion from "../components/Produccion/Modificacion";
import ProduccionPlaneacion from "../components/Produccion/ProduccionPlaneacion";

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

// Rutas para la inspeccion de material
import RegistroInspeccionPieza from "../components/InspeccionMaterial/RegistraInspeccionMaterial";
import ModificaInspeccionPieza from "../components/InspeccionMaterial/ModificaInspeccionMaterial";

// Rutas para la alerta de calidad
import RegistroAlertasCalidad from "../components/AlertasCalidad/RegistraAlertasCalidad";
import ModificaAlertasCalidad from "../components/AlertasCalidad/ModificaAlertasCalidad";

// Rutas para la No Conformidad
import RegistroNoConformidad from "../components/NoConformidad/RegistraNoConformidad";
import ModificaNoConformidad from "../components/NoConformidad/ModificaNoConformidad";

// Rutas para la Liberación de productos y procesos
import RegistroLiberacionProductoProceso from "../components/LiberacionProductoProceso/RegistraLiberacionProductoProceso";
import ModificaLiberacionProductoProceso from "../components/LiberacionProductoProceso/ModificaLiberacionProductoProceso";

// Rutas para la ficha tecnica
import RegistroFichaTecnica from "../components/FichaTecnica/RegistraFichaTecnica";
import ModificaFichaTecnica from "../components/FichaTecnica/ModificaFichaTecnica";

// Rutas para el certificado de calidad
import RegistroCertificadoCalidad from "../components/CertificadosCalidad/RegistraCertificado";
import ModificaCertificadoCalidad from "../components/CertificadosCalidad/ModificaCertificado";

// Rutas para el reporte de produccion
import RegistroReporteProduccion from "../components/ReporteProduccion/RegistroReporteProduccion";
import ModificaReporteProduccion from "../components/ReporteProduccion/ModificaReporteProduccion";

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
import RequisicionPlaneacion from "../components/Requisiciones/RequisicionPlaneacion";

export default [
    {
        path: "/Almacenes",
        exact: true,
        page: Almacenes
    },
    {
        path: "/RegistraRequerimientosPlaneacion",
        exact: true,
        page: RegistraRequerimientosPlaneacion
    },
    {
        path: "/ModificaRequerimientosPlaneacion/:id",
        exact: true,
        page: ModificaRequerimientosPlaneacion
    },
    {
        path: "/RegistraSolicitudMaterialInsumo",
        exact: true,
        page: RegistraSolicitudMaterialInsumo
    },
    {
        path: "/RegistraInspeccionPieza",
        exact: true,
        page: RegistroInspeccionPieza
    },
    {
        path: "/ModificaInspeccionPieza/:id",
        exact: true,
        page: ModificaInspeccionPieza
    },
    {
        path: "/RegistraDevoluciones",
        exact: true,
        page: RegistroDevoluciones
    },
    {
        path: "/RegistroStatusMaterial",
        exact: true,
        page: RegistroStatusMaterial
    },
    {
        path: "/ModificaStatusMaterial/:id",
        exact: true,
        page: ModificaStatusMaterial
    },
    {
        path: "/RegistraAcusesRecibo",
        exact: true,
        page: RegistroAcusesRecibo
    },
    {
        path: "/RegistroCertificadoCalidad",
        exact: true,
        page: RegistroCertificadoCalidad
    },
    {
        path: "/ModificaCertificadoCalidad/:id",
        exact: true,
        page: ModificaCertificadoCalidad
    },
    {
        path: "/RegistroMaquinasMantenimientos",
        exact: true,
        page: RegistroMaquinasMantenimientos
    },
    {
        path: "/RegistroVerificacionMantenimientos",
        exact: true,
        page: RegistroVerificacionMantenimientos
    },
    {
        path: "/ModificaAcusesRecibo",
        exact: true,
        page: ModificacionAcusesRecibo
    }, 
    {
        path: "/RegistraRechazos",
        exact: true,
        page: RegistroRechazos
    },
    {
        path: "/ModificaRechazos",
        exact: true,
        page: ModificacionRechazos
    },    
    {
        path: "/RegistroCotizaciones",
        exact: true,
        page: RegistraCotizaciones
    },
    {
        path: "/Detalles_matriz_producto/:producto",
        exact: true,
        page: VistaDetallada
    },
    {
        path: "/ModificaCotizacion/:id",
        exact: true,
        page: ModificaCotizaciones
    },
    {
        path: "/Registra-Matriz-Productos",
        exact: true,
        page: RegistraMatrizProductos
    },
    {
        path: "/Modifica-Matriz-Productos/:producto",
        exact: true,
        page: ModificaMatrizProductos
    },
    {
        path: "/RegistroUsuarios",
        exact: true,
        page: RegistroUsuarios
    },
    {
        path: "/RegistroLiberacionProductoProceso",
        exact: true,
        page: RegistroLiberacionProductoProceso
    },
    {
        path: "/ModificaLiberacionProductoProceso/:id",
        exact: true,
        page: ModificaLiberacionProductoProceso
    },
    {
        path: "/ModificacionUsuarios/:id",
        exact: true,
        page: ModificacionUsuarios
    },
    {
        path: "/ModificacionUsuarios",
        exact: true,
        page: ModificacionUsuarios
    },
    {
        path: "/RegistroClientes",
        exact: true,
        page: RegistroClientes
    },
    {
        path: "/RegistroProveedores",
        exact: true,
        page: RegistroProveedores
    },
    {
        path: "/RegistroEvaluacionProveedores",
        exact: true,
        page: RegistroEvaluacionProveedores
    },
    {
        path: "/RegistroRazonesSociales",
        exact: true,
        page: RegistroRazonSocial
    },
    {
        path: "/RegistroNoConformidad",
        exact: true,
        page: RegistroNoConformidad
    },
    {
        path: "/ModificaNoConformidad/:id",
        exact: true,
        page: ModificaNoConformidad
    },
    {
        path: "/ModificacionClientes/:id",
        exact: true,
        page: ModificacionClientes
    },
    {
        path: "/ModificacionEvaluacionProveedores/:id",
        exact: true,
        page: ModificacionEvaluacionProveedores
    },
    {
        path: "/ModificacionProveedores/:id",
        exact: true,
        page: ModificacionProveedores
    },
    {
        path: "/ModificacionRazonesSociales/:id",
        exact: true,
        page: ModificacionRazonSocial
    },
    {
        path: "/ModificacionClientes",
        exact: true,
        page: ModificacionClientes
    },
    {
        path: "/RegistroTiquets",
        exact: true,
        page: RegistroTiquets
    },
    {
        path: "/RegistroProgramaProduccion/:semana",
        exact: true,
        page: RegistraProgramaProduccion
    },
    {
        path: "/ModificaProgramaProduccion/:id",
        exact: true,
        page: ModificaProgramaProduccion
    },
    {
        path: "/ModificacionTiquets",
        exact: true,
        page: ModificacionTiquets
    },
    {
        path: "/RegistroEntradaSalidaMoldes",
        exact: true,
        page: RegistroEntradaSalidaMoldes
    },
    {
        path: "/RegistroCarpetasProceso",
        exact: true,
        page: RegistroCarpetasProceso
    },
    {
        path: "/RegistroReporteProduccion",
        exact: true,
        page: RegistroReporteProduccion
    },
    {
        path: "/ModificaReporteProduccion/:id",
        exact: true,
        page: ModificaReporteProduccion
    },
    {
        path: "/RegistroCompras",
        exact: true,
        page: RegistroCompras
    },
    {
        path: "/ModificacionCompras/:folio",
        exact: true,
        page: ModificacionCompras
    },
    {
        path: "/RegistroEmbarque",
        exact: true,
        page: RegistroEmbarque
    },
    {
        path: "/ModificacionEmbarque",
        exact: true,
        page: ModificacionEmbarque
    },
    {
        path: "/RegistroFactura",
        exact: true,
        page: RegistroFactura
    },
    {
        path: "/ModificacionFactura",
        exact: true,
        page: ModificacionFactura
    },
    {
        path: "/RegistroLogistica",
        exact: true,
        page: RegistroLogistica
    },
    {
        path: "/ModificacionLogistica",
        exact: true,
        page: ModificacionLogistica
    },
    {
        path: "/RegistroRecepcion",
        exact: true,
        page: RegistroRecepcion
    },
    {
        path: "/ModificaRecepcion/:id",
        exact: true,
        page: ModificacionRecepcion
    },
    {
        path: "/RegistroPlaneacion",
        exact: true,
        page: RegistroPlaneacion
    },
    {
        path: "/ModificacionPlaneacion/:folio",
        exact: true,
        page: ModificacionPlaneacion
    },
    {
        path: "/Pedido-de-Venta",
        exact: true,
        page: RegistroVentas
    },
    {
        path: "/ModificacionPedido/:folio",
        exact: true,
        page: ModificacionVentas
    },
    {
        path: "/ModificacionPedido",
        exact: true,
        page: ModificacionVentas
    },
    {
        path: "/RegistroProduccion",
        exact: true,
        page: RegistroProduccion
    },
    {
        path: "/ModificacionProduccion/:id",
        exact: true,
        page: ModificacionProduccion
    },
    {
        path: "/ProduccionPlaneacion/:id",
        exact: true,
        page: ProduccionPlaneacion
    },
    {
        path: "/RegistroRequisicion",
        exact: true,
        page: RegistraRequisiciones
    },
    {
        path: "/ModificacionRequisicion/:id",
        exact: true,
        page: ModificaRequisiciones
    },
    {
        path: "/RequisicionPlaneacion/:id",
        exact: true,
        page: RequisicionPlaneacion
    },
    {
        path: "/RegistroRemision",
        exact: true,
        page: RegistraRemisiones
    },
    {
        path: "/Modifica remision",
        exact: true,
        page: ModificaRemisiones
    },
    {
        path: "/RegistroReporte",
        exact: true,
        page: RegistraReporte
    },
    {
        path: "/ModificacionReporte/:id",
        exact: true,
        page: ModificaReporte
    },
    {
        path: "/MatrizProductos",
        exact: true,
        page: MatrizProductos
    },
    {
        path: "/AlertasCalidad",
        exact: true,
        page: AlertasCalidad
    },
    {
        path: "/Devoluciones",
        exact: true,
        page: Devoluciones
    },
    {
        path: "/LiberacionProductoProceso",
        exact: true,
        page: LiberacionProductoProceso
    },
    {
        path: "/StatusMaterial",
        exact: true,
        page: StatusMaterial
    },
    {
        path: "/UnidadesMedida",
        exact: true,
        page: UnidadesMedida
    },
    {
        path: "/Acuses_de_Recibos",
        exact: true,
        page: AcusesRecibo
    },
    {
        path: "/Rechazos",
        exact: true,
        page: Rechazos
    },
    {
        path: "/Sucursales",
        exact: true,
        page: Sucursales
    },
    {
        path: "/FichaTecnica",
        exact: true,
        page: FichaTecnica
    },
    {
        path: "/NoConformidad",
        exact: true,
        page: NoConformidad
    },
    {
        path: "/RegistroAlertasCalidad",
        exact: true,
        page: RegistroAlertasCalidad
    },
    {
        path: "/ModificaAlertasCalidad/:id",
        exact: true,
        page: ModificaAlertasCalidad
    },
    {
        path: "/RegistroFichaTecnica",
        exact: true,
        page: RegistroFichaTecnica
    },
    {
        path: "/ModificaFichaTecnica/:id",
        exact: true,
        page: ModificaFichaTecnica
    },
    {
        path: "/RegistroControlParametrosMaquina",
        exact: true,
        page: RegistroControlParametrosMaquina
    },
    {
        path: "/RegistroMantenimiento",
        exact: true,
        page: RegistroMantenimiento
    },
    {
        path: "/InspeccionPieza",
        exact: true,
        page: InspeccionPieza
    },
    {
        path: "/Remisión",
        exact: true,
        page: Remisiones
    },
    {
        path: "/Calidad",
        exact: true,
        page: Calidad
    },
    {
        path: "/ClasificacionMateriales",
        exact: true,
        page: ClasificacionMateriales
    },
    {
        path: "/ClasificacionMaquinaria",
        exact: true,
        page: ClasificacionMaquinaria
    },
    {
        path: "/Logs",
        exact: true,
        page: Logs
    },
    {
        path: "/Requisiciones",
        exact: true,
        page: Requisiciones
    },
    {
        path: "/EtiquetaPrimeraPieza",
        exact: true,
        page: EtiquetaPrimeraPieza
    },
    {
        path: "/EvaluacionProveedores",
        exact: true,
        page: EvaluacionProveedores
    },
    {
        path: "/Usuarios",
        exact: true,
        page: Usuarios
    },
    {
        path: "/GestionAlmacen",
        exact: true,
        page: GestionAlmacen
    },
    {
        path: "/Materiales",
        exact: true,
        page: MateriasPrimas
    },
    {
        path: "/Departamentos",
        exact: true,
        page: Departamentos
    },
    {
        path: "/VentasGastos",
        exact: true,
        page: VentasGastos
    },
    {
        path: "/Clientes",
        exact: true,
        page: Clientes
    },
    {
        path: "/Proveedores",
        exact: true,
        page: Proveedores
    },
    {
        path: "/RazonesSociales",
        exact: true,
        page: RazonesSociales
    },
    {
        path: "/Tracking",
        exact: true,
        page: Tracking
    },
    {
        path: "/Compras",
        exact: true,
        page: Compras
    },
    {
        path: "/AsignacionPedido",
        exact: true,
        page: AsignacionPedido
    },
    {
        path: "/Embarque",
        exact: true,
        page: Embarque
    },
    {
        path: "/Facturacion",
        exact: true,
        page: Facturacion
    },
    {
        path: "/Logistica",
        exact: true,
        page: Logistica
    },
    {
        path: "/ProgramaProduccion/:semana",
        exact: true,
        page: ProgramaProduccion
    },
    {
        path: "/CertificadosCalidad",
        exact: true,
        page: CertificadosCalidad
    },
    {
        path: "/Planeacion",
        exact: true,
        page: Planeacion
    },
    {
        path: "/Cotizaciones",
        exact: true,
        page: Cotizaciones
    },
    {
        path: "/Produccion",
        exact: true,
        page: Produccion
    },
    {
        path: "/Ventas",
        exact: true,
        page: Ventas
    },
    {
        path: "/Tiquets",
        exact: true,
        page: Tiquets
    },
    {
        path: "/RecepcionMaterialInsumos",
        exact: true,
        page: RecepcionMaterialInsumos
    },
    {
        path: "/Mes",
        exact: true,
        page: Mes
    },
    {
        path: "/Semana",
        exact: true,
        page: Semana
    },
    {
        path: "/Maquinaria",
        exact: true,
        page: Maquinaria
    },
    {
        path: "/Maquinas",
        exact: true,
        page: Maquinas
    },
    {
        path: "/ReporteProduccion",
        exact: true,
        page: ReporteProduccion
    },
    {
        path: "/IdentificacionPT",
        exact: true,
        page: IdentificacionPT
    },
    {
        path: "/MaterialMolido",
        exact: true,
        page: MaterialMolido
    },
    {
        path: "/CarpetasProceso",
        exact: true,
        page: CarpetasProceso
    },
    {
        path: "/ControlParametrosMaquina",
        exact: true,
        page: ControlParametrosMaquina
    },
    {
        path: "/Mantenimiento",
        exact: true,
        page: Mantenimiento
    },
    {
        path: "/EtiquetasMoldes",
        exact: true,
        page: EtiquetasMoldes
    },
    {
        path: "/InventarioMaquinas",
        exact: true,
        page: InventarioMaquinas
    },
    {
        path: "/InventarioMoldes",
        exact: true,
        page: InventarioMoldes
    },
    {
        path: "/MantenimientoPreventivo",
        exact: true,
        page: MantenimientoPreventivo
    },
    {
        path: "/EntradaSalidaMoldes",
        exact: true,
        page: EntradaSalidaMoldes
    },
    {
        path: "/VerificacionMantenimientos",
        exact: true,
        page: VerificacionMantenimientos
    },
    {
        path: "/SolicitudMaterialInsumo",
        exact: true,
        page: SolicitudMaterialInsumo
    },
    {
        path: "/DashboardVentas",
        exact: true,
        page: DashboardVentas
    },
    {
        path: "/DashboardCompras",
        exact: true,
        page: DashboardCompras
    },
    {
        path: "/DashboardPlaneacion",
        exact: true,
        page: DashboardPlaneacion
    },
    {
        path: "/DashboardProduccion",
        exact: true,
        page: DashboardProduccion
    },
    {
        path: "/DashboardCalidad",
        exact: true,
        page: DashboardCalidad
    },
    {
        path: "/DashboardMantenimiento",
        exact: true,
        page: DashboardMantenimiento
    },
    {
        path: "/RequerimientosPlaneacion",
        exact: true,
        page: RequerimientosPlaneacion
    },
    {
        path: "/DashboardCatalogos",
        exact: true,
        page: DashboardCatalogos
    },
    {
        path: "/DashboardConfiguracion",
        exact: true,
        page: DashboardConfiguracion
    },
    {
        path: "/",
        exact: true,
        page: Dashboard
    },
    {
        path: "*",
        exact: true,
        page: Error404
    }
]
