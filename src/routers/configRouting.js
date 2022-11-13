// Rutas generales del sistema
import Dashboard from "../page/Dashboard";
import Productos from "../page/CatalogoProductos";
import Tiquets from "../page/Tiquets";
import Almacen from "../page/Almacen";
import Compras from "../page/Compras";
import Embarque from "../page/Embarque";
import Facturacion from "../page/Facturacion";
import Logistica from "../page/Logistica";
import Planeacion from "../page/Planeacion";
import Produccion from "../page/Produccion";
import Ventas from "../page/Ventas";
import Usuarios from "../page/Usuarios";
import Clientes from "../page/Clientes";
import Departamentos from "../page/Departamentos";
import MateriasPrimas from "../page/MateriasPrimas";
import Cotizaciones from "../page/Cotizaciones";
import Proveedores from "../page/Proveedores";
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
import Maquinaria from "../page/Maquinaria";
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

// importacion de dashboards
import DashboardVentas from "../components/Dashboards/DashboardVentas";
import DashboardCompras from "../components/Dashboards/DashboardCompras";
import DashboardAlmacenes from "../components/Dashboards/DashboardAlmacenes";
import DashboardProductos from "../components/Dashboards/DashboardProductos";
import DashboardPlaneacion from "../components/Dashboards/DashboardPlaneacion";
import DashboardProduccion from "../components/Dashboards/DashboardProduccion";
import DashboardCalidad from "../components/Dashboards/DashboardCalidad";
import DashboardMantenimiento from "../components/Dashboards/DashboardMantenimiento";

// Importacion de almacenes
import AlmacenMP from "../page/AlmacenMP";
import AlmacenPt from "../page/AlmacenPT";
import AlmacenGeneral from "../page/AlmacenGeneral";

// Importaciones para las compras que realiza el almacen
import ComprasAlmacenMP from "../page/ComprasAlmacenMP";
import RegistroComprasAlmacenMP from "../components/ComprasAlmacenMP/RegistroComprasAlmacenMP";
import ModificacionComprasAlmacenMP from "../components/ComprasAlmacenMP/ModificacionComprasAlmacenMP";

// Listado de movimientos de materia prima en almacen
import MovimientosAlmacenMP from "../page/MovimientosAlmacenMP";
import MovimientosAlmacenPT from "../page/MovimientosAlmacenPT";
import MovimientosAlmacenGeneral from "../page/MovimientosAlmacenGeneral";

// Importacion de componentes de vista previa de vista PDF
import VistaPrevia from "../components/Ventas/VistaPrevia";

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

// Rutas para las renisiones
import RegistraRemisiones from "../components/Remisiones/RegistraRemisiones";
import ModificaRemisiones from "../components/Remisiones/ModificaRemisiones";

// Rutas para las cotizaciones
import RegistraCotizaciones from "../components/Cotizaciones/RegistraCotizaciones";
import ModificaCotizaciones from "../components/Cotizaciones/ModificaCotizaciones";

// Rutas para los productos
import RegistraProductos from "../components/CatalogoProductos/RegistraProductos";
import ModificaProductos from "../components/CatalogoProductos/ModificaProductos";

// Rutas para los usuarios (colaboradores)
import RegistroUsuarios from "../components/Usuarios/Registro";
import ModificacionUsuarios from "../components/Usuarios/Modificacion";

// Rutas para los clientes
import RegistroClientes from "../components/Clientes/Registro";
import ModificacionClientes from "../components/Clientes/Modificacion";

// Rutas para los tiquets
import RegistroTiquets from "../components/Tiquets/Registro";
import ModificacionTiquets from "../components/Tiquets/Modificacion";

// Rutas para el almacen
import RegistroAlmacen from "../components/Almacen/Registro";
import ModificacionAlmacen from "../components/Almacen/Modificacion";

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

// Rutas para planeación
import RegistroPlaneacion from "../components/Planeacion/Registro";
import ModificacionPlaneacion from "../components/Planeacion/Modificacion";

// Rutas para las ventas
import RegistroVentas from "../components/Ventas/Registro";
import ModificacionVentas from "../components/Ventas/Modificacion";

// Rutas para producción
import RegistroProduccion from "../components/Produccion/Registro";
import ModificacionProduccion from "../components/Produccion/Modificacion";

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

// Rutas para la inspeccion de material
import RegistroInspeccionPieza from "../components/InspeccionMaterial/RegistraInspeccionMaterial";

// Rutas para la alerta de calidad
import RegistroAlertasCalidad from "../components/AlertasCalidad/RegistraAlertasCalidad";

// Rutas para la No Conformidad
import RegistroNoConformidad from "../components/NoConformidad/RegistraNoConformidad";

// Rutas para la Liberación de productos y procesos
import RegistroLiberacionProductoProceso from "../components/LiberacionProductoProceso/RegistraLiberacionProductoProceso";

// Rutas para la ficha tecnica
import RegistroFichaTecnica from "../components/FichaTecnica/RegistraFichaTecnica";

// Rutas para el certificado de calidad
import RegistroCertificadoCalidad from "../components/CertificadosCalidad/RegistraCertificado";

// Rutas para el reporte de produccion
import RegistroReporteProduccion from "../components/ReporteProduccion/RegistroReporteProduccion";

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

export default [
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
        path: "/Registra-CatalogoProductos",
        exact: true,
        page: RegistraProductos
    },
    {
        path: "/Modifica-Producto/:id",
        exact: true,
        page: ModificaProductos
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
        path: "/RegistroNoConformidad",
        exact: true,
        page: RegistroNoConformidad
    },
    {
        path: "/ModificacionClientes/:id",
        exact: true,
        page: ModificacionClientes
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
    //
    {
        path: "/AlmacenGeneral/Movimientos/:folioAlmacen",
        exact: true,
        page: MovimientosAlmacenGeneral
    },
    //
    {
        path: "/RegistroAlmacen",
        exact: true,
        page: RegistroAlmacen
    },
    {
        path: "/ModificacionAlmacen/:id",
        exact: true,
        page: ModificacionAlmacen
    },
    {
        path: "/ModificacionAlmacen",
        exact: true,
        page: ModificacionAlmacen
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
        path: "/Compras/AlmacenMP/Modificacion/:folio",
        exact: true,
        page: ModificacionComprasAlmacenMP
    },
    {
        path: "/Compras/AlmacenMP/Registro",
        exact: true,
        page: RegistroComprasAlmacenMP
    },
    {
        path: "/MovimientosAlmacenGeneral/:folioAlmacen",
        exact: true,
        page: MovimientosAlmacenGeneral
    },
    {
        path: "/MovimientosAlmacenPT/:folioMP",
        exact: true,
        page: MovimientosAlmacenPT
    },
    {
        path: "/AlertasCalidad",
        exact: true,
        page: AlertasCalidad
    },
    {
        path: "/MovimientosAlmacenMP/:folioMP",
        exact: true,
        page: MovimientosAlmacenMP
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
        path: "/RegistroFichaTecnica",
        exact: true,
        page: RegistroFichaTecnica
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
        path: "/Logs",
        exact: true,
        page: Logs
    },
    {
        path: "/Compras/AlmacenMP",
        exact: true,
        page: ComprasAlmacenMP
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
        path: "/Proveedores",
        exact: true,
        page: Proveedores
    },
    {
        path: "/Usuarios",
        exact: true,
        page: Usuarios
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
        path: "/AlmacenGeneral",
        exact: true,
        page: AlmacenGeneral
    },
    {
        path: "/AlmacenPT",
        exact: true,
        page: AlmacenPt
    },
    {
        path: "/AlmacenMP",
        exact: true,
        page: AlmacenMP
    },
    {
        path: "/Almacen",
        exact: true,
        page: Almacen
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
        path: "/CatalogoProductos",
        exact: true,
        page: Productos
    },
    {
        path: "/Tiquets",
        exact: true,
        page: Tiquets
    },
    {
        path: "/Mes",
        exact: true,
        page: Mes
    },
    {
        path: "/Maquinaria",
        exact: true,
        page: Maquinaria
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
        path: "/DashboardAlmacenes",
        exact: true,
        page: DashboardAlmacenes
    },
    {
        path: "/DashboardProductos",
        exact: true,
        page: DashboardProductos
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
        path: "/",
        exact: true,
        page: Dashboard
    }
]
