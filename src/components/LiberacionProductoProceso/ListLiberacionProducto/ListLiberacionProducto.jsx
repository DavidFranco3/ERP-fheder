import {useEffect, useMemo, useState} from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {map} from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminaLiberacionProducto from '../EliminaLiberacionProducto';
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import "./ListLiberacionProducto.scss";
//import ClientesPedido from "./ClientesPedido";
import {estilos} from "../../../utils/tableStyled";

function ListLiberacionProducto(props) {
    const { setRefreshCheckLogin, listLiberacion, history, location } = props;

    const enrutamiento = useHistory();

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaLiberacion = (content) => {
        setTitulosModal("Eliminando la liberacion del producto");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaLiberacion = (id) => {
        enrutamiento.push(`/ModificaLiberacionProductoProceso/${id}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = () => {
        // enrutamiento.push("")
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
            name: "Cliente",
            selector: row => row.cliente,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Pieza",
            selector: row => row.descripcionPieza,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. Parte/No. Molde",
            selector: row => row.noParteMolde,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Proceso",
            selector: row => row.procesoRealizado,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha elaboracion",
            selector: row => moment(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha arranque molde",
            selector: row => moment(row.fechaArranqueMolde).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. Maquina",
            selector: row => row.noMaquina,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Hoja liberacion",
            selector: row => row.hojaLiberacion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Elaboró",
            selector: row => row.elaboro,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Turno",
            selector: row => row.turno,
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
                        bg="primary"
                        title="Generar PDF"
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
                            modificaLiberacion(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaLiberacion(
                                <EliminaLiberacionProducto
                                    datos={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
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
            setRows(listLiberacion);
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
                    // actions={descargaCSV}
                    data={listLiberacion}
                    //expandableRows
                    //expandableRowsComponent={ExpandedComponent}
                    progressPending={pending}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
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

export default ListLiberacionProducto;
