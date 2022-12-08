import { useState, useEffect } from 'react';
import { Badge, Container } from "react-bootstrap";
import "./ListRequisiciones.scss"
import BasicModal from "../../Modal/BasicModal";
//import EstadoProveedor from "../EstadoProveedor";
//import ModificaProveedores from "../ModificaProveedores";
import EliminaRequisiciones from "../EliminaRequisiciones";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import moment from "moment";
import ModificaRequisiciones from '../ModificaRequisiciones';
import { useHistory } from "react-router-dom";

function ListRequisiciones(props) {
    const { listRequisiciones, setRefreshCheckLogin, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalRequisiciones } = props;

    moment.locale("es");

    const enrutamiento = useHistory();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de proveedores
    const eliminacionRequisicion = (content) => {
        setTitulosModal("Eliminando requisicion");
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
    const ModificacionRequisicion = (id) => {
        enrutamiento.push(`/ModificacionRequisicion/${id}`);
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
            name: 'Fecha elaboracion',
            selector: row => moment(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Solicitante',
            selector: row => row.solicitante,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Departamento',
            selector: row => row.departamento,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Aprobo',
            selector: row => row.aprobo == "" ? "No disponible" : row.aprobo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Comentarios',
            selector: row => row.comentarios == "" ? "Sin comentarios" : row.comentarios,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            selector: row => row.status == "" ? "No definido" : row.status,
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
                            ModificacionRequisicion(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminarProveedor"
                        onClick={() => {
                            eliminacionRequisicion(
                                <EliminaRequisiciones
                                    datosRequisicion={row}
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
            setRows(listRequisiciones);
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
                    noDataComponent="No hay registros para mostrar"
                    columns={columns}
                    data={listRequisiciones}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalRequisiciones}
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

export default ListRequisiciones;
