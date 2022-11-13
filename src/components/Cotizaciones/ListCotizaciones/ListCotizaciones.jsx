import { useState, useEffect } from 'react';
import moment from "moment";
import { useHistory } from "react-router-dom";
import {Badge, Container} from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import BasicModal from "../../Modal/BasicModal";
import EliminaCotizaciones from "../EliminaCotizaciones";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import Clientes from "./Clientes";
import Proveedor from "./Proveedor";
import EliminacionLogicaCotizaciones from "../EliminacionLogica";

function ListCotizaciones(props) {
    const { setRefreshCheckLogin, location, history, listCotizaciones, rowsPerPage, setRowsPerPage, page, setPage, noTotalCotizaciones } = props;

    // console.log(listCotizaciones)

    // Para definir el uso del enrutamiento
    const enrutamiento = useHistory()

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion de las cotizaciones
    const eliminaCotizacion = (content) => {
        setTitulosModal("Eliminando la cotización");
        setContentModal(content);
        setShowModal(true);
    }
    
    //Para la eliminacion logica de usuarios
    const eliminaLogicaCotizaciones = (content) => {
        setTitulosModal("Deshabilitando cotización");
        setContentModal(content);
        setShowModal(true);
    }
    
    //Para la eliminacion logica de usuarios
    const habilitaCotizaciones = (content) => {
        setTitulosModal("Habilitando cotización");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la ruta de registro de la cotizacion
    const registraCotizacion = (id) => {
        enrutamiento.push(`/ModificaCotizacion/${id}`)
    }

    // Para la modificacion de la cotizacion
    const modificaCotizacion = (id) => {
        enrutamiento.push(`/ModificaCotizacion/${id}`);
    }

    // Define el uso de svg personalizado
    createTheme(
        "collapsedButton",{
            expander: {
                fontColor: 'rgba(0,0,0,.87)',
                //backgroundColor: 'transparent',
                collapsedButton: (<FontAwesomeIcon icon={faEye}/>),
                expandedButton: (<FontAwesomeIcon icon={faEye}/>),
            }
        }
    )

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => (
                <>
                    <Clientes
                        id={row.cliente}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Vendedor",
            selector: row => (
                <>
                    <Proveedor
                        id={row.vendedor}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Status",
            selector: row => row.status === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                className="editar"
                                onClick={() => {
                                    const dataCotizacion = {
                                        id: row.id,
                                        cliente: row.cliente,
                                        vendedor: row.vendedor,
                                        status: row.status
                                    }
                                    eliminaLogicaCotizaciones(<EliminacionLogicaCotizaciones dataCotizacion={dataCotizacion} setShowModal={setShowModal} history={history} />)
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
                                className="eliminar"
                                onClick={() => {
                                    const dataCotizacion = {
                                        id: row.id,
                                        cliente: row.cliente,
                                        vendedor: row.vendedor,
                                        status: row.status
                                    }
                                    habilitaCotizaciones(<EliminacionLogicaCotizaciones dataCotizacion={dataCotizacion} setShowModal={setShowModal} history={history} />)
                                }}
                            >
                                Inactivo
                                </Badge>
                        </>
                        ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Fecha de creación',
            selector: row => moment(row.fechaRegistro).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Fecha de modificación',
            selector: row => moment(row.fechaActualizacion).format("LL"),
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
                        bg="success"
                        className="editar"
                        onClick={() => {
                            modificaCotizacion(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        onClick={() => {
                            const datosCotizacion = {
                                id: row.id,
                                folio: row.folio,
                                cliente: row.cliente,
                                vendedor: row.vendedor
                            }
                            eliminaCotizacion(
                                <EliminaCotizaciones
                                    datosCotizacion={datosCotizacion}
                                    location={location}
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

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listCotizaciones);
            setPending(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);


    const [resetPaginationToogle, setResetPaginationToogle] = useState(false);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };
    
    // Definicion de la paginacion
    const handlePageChange = (page) => {
        setPage(page)
    }

    const handlePerRowsChange = (newPerPage, page) => {
        setRowsPerPage(newPerPage)
    }

    return (
        <>
            <Container fluid>
            <DataTable
                    columns={columns}
                    data={listCotizaciones}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    paginationServer
                    paginationTotalRows={noTotalCotizaciones}
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

export default ListCotizaciones;
