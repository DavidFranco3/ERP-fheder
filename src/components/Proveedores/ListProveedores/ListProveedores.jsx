import { useState, useEffect } from 'react';
import { Badge, Container } from "react-bootstrap";
import "./ListProveedores.scss"
import BasicModal from "../../Modal/BasicModal";
import EstadoProveedor from "../EstadoProveedor";
import ModificaProveedores from "../ModificaProveedores";
import EliminaProveedores from "../EliminaProveedores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';

function ListProveedores(props) {
    const { listProveedores, setRefreshCheckLogin, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalProveedores } = props;

    // console.log(listProveedores)

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
    const cambiarStatusProveedor = (content) => {
        setTitulosModal("Cambiando status del vendedor");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de proveedores
    const modificacionProveedor = (content) => {
        setTitulosModal("Modificando datos proveedor");
        setContentModal(content);
        setShowModal(true);
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
            name: 'Producto/Servicio que proporciona',
            selector: row => row.productoServicio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Categoría',
            selector: row => row.categoria,
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
                            className="editarProveedor"
                            onClick={() => {
                                const dataTemp = {
                                    id: row.id,
                                    folio: row.folio,
                                    nombre: row.nombre,
                                    estado: row.estado
                                }
                                cambiarStatusProveedor(
                                    <EstadoProveedor
                                        dataProveedor={dataTemp}
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
                            bg="warning"
                            className="editarProveedor"
                            onClick={() => {
                                const dataTemp = {
                                    id: row.id,
                                    folio: row.folio,
                                    nombre: row.nombre,
                                    estado: row.estado
                                }
                                cambiarStatusProveedor(
                                    <EstadoProveedor
                                        dataProveedor={dataTemp}
                                        setShowModal={setShowModal}
                                        history={history}
                                    />
                                )
                            }}
                        >
                            Deshabilitado
                        </Badge>
                    </>
                ),
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
                        bg="info"
                        className="evaluacionProveedor"
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        className="editarProveedor"
                        onClick={() => {
                            const dataTemp = {
                                id: row.id,
                                folio: row.folio,
                                nombre: row.nombre,
                                tipo: row.tipo,
                                productoServicio: row.productoServicio,
                                categoria: row.categoria,
                                personalContacto: row.personalContacto,
                                telefono: row.telefono,
                                correo: row.correo,
                                tiempoCredito: row.tiempoCredito,
                                tiempoRespuesta: row.tiempoRespuesta,
                                lugarRecoleccion: row.lugarRecoleccion,
                                horario: row.horario,
                                comentarios: row.comentarios
                            }
                            modificacionProveedor(
                                <ModificaProveedores
                                    dataProveedor={dataTemp}
                                    history={history}
                                    setShowModal={setShowModal}
                                />
                            )
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminarProveedor"
                        onClick={() => {
                            const dataTemp = {
                                id: row.id,
                                folio: row.folio,
                                nombre: row.nombre
                            }
                            eliminacionProveedor(
                                <EliminaProveedores
                                    dataProveedor={dataTemp}
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
        }
    ];

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

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
                    data={listProveedores}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalProveedores}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListProveedores;
