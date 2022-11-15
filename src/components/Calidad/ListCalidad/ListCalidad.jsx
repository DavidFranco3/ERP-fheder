import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import LayoutPrincipal from "../../../layout/layoutPrincipal";
// Inician importaciones para la tabla
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
//import ProveedoresenCompras from "./ProveedoresenCompras";
import EliminaReporte from "../EliminaReporte";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { map } from "lodash";

function ListCalidad(props) {
    const { setRefreshCheckLogin, listInspeccion, history, location, rowsPerPage, setRowsPerPage, page, setPage, noTotalInspeccion } = props;

    moment.locale("es");

    // Definicion de la paginacion
    const handlePageChange = (page) => {
        setPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage)
    }

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useHistory();

    //Para la eliminacion de compras
    const eliminacionInspeccion = (content) => {
        setTitulosModal("Eliminando inspeccion de calidad");
        setContentModal(content);
        setShowModal(true);
    }

    const modificacionCalidad = (id) => {
        enrutamiento.push(`/ModificacionReporte/${id}`)
    }

    const columns = [
        {
            name: "ITEM",
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de solicitud",
            selector: row => moment(row.fecha).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Lote",
            selector: row => row.lote,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Propiedad",
            selector: row => row.propiedad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo de material",
            selector: row => row.tipoMaterial,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre / Descripción",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad",
            selector: row => row.cantidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "UM",
            selector: row => row.unidadMedida,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Resultado final",
            selector: row => row.resultadoFinalInspeccion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Recibio",
            selector: row => row.nombreRecibio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: true,
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
                        modificacionCalidad(row.id)
                    }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>

                    <Badge
                        bg="danger"
                        className="eliminarProveedor"
                        onClick={() => {
                            eliminacionInspeccion(
                                <EliminaReporte
                                    data={row}
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
            setRows(listInspeccion);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);


    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    // actions={descargaCSV}
                    data={listInspeccion}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalInspeccion}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListCalidad;
