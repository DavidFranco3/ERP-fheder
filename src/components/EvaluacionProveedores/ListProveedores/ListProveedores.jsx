import { useState, useEffect } from 'react';
import { Badge, Container } from "react-bootstrap";
import "./ListProveedores.scss"
import BasicModal from "../../Modal/BasicModal";
import EstadoProveedor from "../EstadoProveedor";
import EliminaProveedores from "../EliminaProveedores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import DataTable from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListProveedores(props) {
    const { listProveedores, setRefreshCheckLogin, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    const enrutamiento = useNavigate();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de proveedores
    const eliminacionProveedor = (content) => {
        setTitulosModal("Eliminando proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    //Para cambiar el status del proveedor
    const deshabilitandoProveedor = (content) => {
        setTitulosModal("Cancelando la evaluacion del proveedor");
        setContentModal(content);
        setShowModal(true);
    }

    // Ruta para enlazar a pagina de usuarios
    const irHaciaModificacion = (id) => {
        enrutamiento(`/ModificacionEvaluacionProveedores/${id}`);
    }

    // Ruta para enlazar a pagina de usuarios
    const vistaPreviaEvaluacionProveedores = (id) => {
        enrutamiento(`/VistaPreviaEvaluacionProveedores/${id}`);
    }

    // Para llenar la evaluación del proveedor
    const registraEvaluacion = (idProveedor) => {
    }

    const columns = [
        {
            name: 'ITEM',
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Folio',
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Personal de contacto',
            selector: row => row.personalContacto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Email',
            selector: row => row.correo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Tiempo credito',
            selector: row => row.tiempoCredito + " dias",
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Tiempo respuesta',
            selector: row => row.tiempoRespuesta + " dias",
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Personal de contacto',
            selector: row => row.personalContacto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Lugar de recolección',
            selector: row => row.lugarRecoleccion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Horario',
            selector: row => row.horario,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Observaciones',
            selector: row => row.comentarios,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            selector: row => row.estado === "true" ?
                (
                    <>
                        <Badge
                            bg="success"
                            title="Deshabilitar"
                            className="editarProveedor"
                            onClick={() => {
                                deshabilitandoProveedor(
                                    <EstadoProveedor
                                        dataProveedor={row}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            Habilitado
                        </Badge>
                    </>
                )
                :
                (
                    <>
                        <Badge
                            bg="danger"
                            title="Habilitar"
                            className="editarProveedor"
                        >
                            Cancelada
                        </Badge>
                    </>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ultima modificacion",
            selector: row => dayjs(row.fechaActualizacion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="info"
                                title="Generar PDF"
                                className="evaluacionProveedor"
                                onClick={() => {
                                    vistaPreviaEvaluacionProveedores(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faEye} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editarProveedor"
                                onClick={() => {
                                    irHaciaModificacion(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    eliminacionProveedor(
                                        <EliminaProveedores
                                            dataProveedor={row}
                                            history={history}
                                            setShowModal={setShowModal}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
                            </Badge>
                        </>
                    )
                    :
                    (
                        "No disponibles"
                    )
            )
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listProveedores);
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
                    noDataComponent="No hay registros para mostrar"
                    data={listProveedores}
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

export default ListProveedores;
