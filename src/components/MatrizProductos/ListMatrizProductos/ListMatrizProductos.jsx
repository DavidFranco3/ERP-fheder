import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Badge, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import EstadoMatrizProductos from "../EstadoMatrizProductos";
import EliminaMatrizProductos from "../EliminaMatrizProductos";
import BusquedaCliente from "./BusquedaCliente";
import "./ListMatrizProductos.scss";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListMatrizProductos(props) {
    const { listProductos, history, location, setRefreshCheckLogin } = props;
    //console.log(listProductos)

    const enrutamiento = useHistory();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para ir hacia la ruta de modificacion
    const rutaModificaProductos = (id) => {
        enrutamiento.push(`Modifica-Matriz-Productos/${id}`)
    }

    // Para definir la ruta de la vista detallada de productos en la matriz de productos
    const rutaVistaDetalladaMatrizProductos = (producto) => {
        enrutamiento.push(`/Detalles_matriz_producto/${producto}`)
    }


    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de clientes
    const eliminaProducto = (content) => {
        setTitulosModal("Eliminando el producto");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion fisica de clientes
    const cambiaEstadoProducto = (content) => {
        setTitulosModal("Cambiando estado del producto");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: "# Interno",
            selector: row => row.noInterno,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => (
                <>
                    <BusquedaCliente
                        idCliente={row.cliente}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. Molde",
            selector: row => row.datosMolde.noMolde,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cav. Molde",
            selector: row => row.datosMolde.cavMolde,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Descripción",
            selector: row => row.descripcion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => row.estado === "true" ?
                (
                    <>
                        <Badge
                            bg="success" 
                            title="Deshabilitar"
                            className="activo"
                            onClick={() => {
                                cambiaEstadoProducto(
                                    <EstadoMatrizProductos
                                        dataProducto={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            Activo
                        </Badge>
                    </>
                )
                :
                (
                    <>
                        <Badge
                            bg="danger" 
                            className="obsoleto"
                            title="Habilitar"
                            onClick={() => {
                                cambiaEstadoProducto(
                                    <EstadoMatrizProductos
                                        dataProducto={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            Obsoleto
                        </Badge>
                    </>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ultima modificacion",
            selector: row => dayjs(row.fechaAdquisicion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        title="Generar PDF"
                        bg="primary"
                        className="ver"
                        onClick={() => {
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        title="Modificar"
                        className="editar"
                        onClick={() => {
                            rutaModificaProductos(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaProducto(
                                <EliminaMatrizProductos
                                    dataProducto={row}
                                    location={location}
                                    setShowModal={setShowModal}
                                    history={history}
                                />
                            )
                        }}
                    >
                        <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                    </Badge>
                </>
            )
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listProductos);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={listProductos}
                    noDataComponent="No hay registros para mostrar"
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListMatrizProductos;
