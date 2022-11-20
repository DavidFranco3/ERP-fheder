import { useState, useEffect } from 'react';
import moment from "moment";
import 'moment/locale/es';
import {map} from "lodash";
import { useHistory } from "react-router-dom";
import { Badge, Button, Container } from "react-bootstrap";
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import "./ListProductos.scss";
import BasicModal from "../../Modal/BasicModal";
import EstadoProducto from "../EstadoProducto";
import EliminaProductos from "../EliminaProductos";
import BusquedaMateriaPrima from "./BusquedaMateriaPrima";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import {estilos} from "../../../utils/tableStyled";
import TableRow from "@mui/material/TableRow";

function ListProductos(props) {
    const { listProductos, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalProductos } = props;

    // Configura el idioma a español
    moment.locale("es");
    const enrutamiento = useHistory();

    // Para ir hacia la ruta de modificacion
    const rutaModificaProductos = (id) => {
        enrutamiento.push(`Modifica-Producto/${id}`)
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
                    selector: row => row.cliente,
                    sortable: false,
                    center: true,
                    reorder: false
                },
                {
                    name: "No. Parte",
                    selector: row => row.noParte,
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
                    name: "Materia Prima",
                    selector: row => (
                        <BusquedaMateriaPrima
                            idmateriaPrima={row.materiaPrima}
                        />
                    ),
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
                                    bg="success" className="activo"
                                    onClick={() => {
                                        cambiaEstadoProducto(
                                            <EstadoProducto
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
                                    bg="warning" className="obsoleto"
                                    onClick={() => {
                                        cambiaEstadoProducto(
                                            <EstadoProducto
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
                    name: 'Acciones',
                    center: true,
                    reorder: false,
                    selector: row => (
                        <>
                            <Badge
                                bg="success"
                                className="editar"
                                onClick={() => {
                                    rutaModificaProductos(row.id)
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                className="eliminar"
                                onClick={() => {
                                    eliminaProducto(
                                        <EliminaProductos
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
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalProductos}
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

export default ListProductos;
