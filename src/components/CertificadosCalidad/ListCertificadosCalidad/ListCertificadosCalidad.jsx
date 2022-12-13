import {useEffect, useMemo, useState} from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {map} from "lodash";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaCertificados from '../EliminacionFisica/EliminacionFisicaCertificados';
import styled from 'styled-components';
import DataTable  from 'react-data-table-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye} from "@fortawesome/free-solid-svg-icons";
import "./ListCertificadosCalidad.scss";
//import ProductosPedido from "./ProductosPedido";
import {estilos} from "../../../utils/tableStyled";

function ListCertificadosCalidad(props) {
    const { setRefreshCheckLogin, listCertificados, history, location } = props;

    const enrutamiento = useHistory();

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaCertificado = (content) => {
        setTitulosModal("Eliminando el certificado");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaCertificado = (id) => {
        enrutamiento.push(`/ModificaCertificadoCalidad/${id}`);
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
            name: "Fecha (Lote)",
            selector: row => moment(row.fecha).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "No. Orden interna",
            selector: row => row.noOrdenInterna,
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
            name: "Tamaño lote",
            selector: row => row.tamañoLote,
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
            name: "No. Parte",
            selector: row => row.numeroParte,
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
                            modificaCertificado(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaCertificado(
                                <EliminacionFisicaCertificados
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
            setRows(listCertificados);
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
                    data={listCertificados}
                    noDataComponent="No hay registros para mostrar"
                    // expandableRows
                    // expandableRowsComponent={ExpandedComponent}
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

export default ListCertificadosCalidad;
