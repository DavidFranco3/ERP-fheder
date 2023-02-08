import { useEffect, useMemo, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Badge, Button, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaPlaneacion from "../EliminacionFisica";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListProduccion.scss";
import ProductosPedido from "./ProductosPedido";
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaPlaneacion from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListProduccion(props) {
    const { setRefreshCheckLogin, listRequerimientosPlaneacion, history, location } = props;

    const enrutamiento = useHistory();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)
    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaPlaneacion = (content) => {
        setTitulosModal("Eliminando de la planeacion");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaPlaneacion = (content) => {
        setTitulosModal("Cancelando la planeación");
        setContentModal(content);
        setShowModal(true);
    }

    // Para la modificacion de datos del pedido
    const modificaPedidoVenta = (id) => {
        enrutamiento.push(`/ModificaRequerimientosPlaneacion/${id}`);
    }

    // Para la modificacion de datos del pedido
    const requisicionPlaneacion = (id) => {
        enrutamiento.push(`/RequisicionPlaneacion/${id}`);
    }

    // Para la modificacion de datos del pedido
    const produccionPlaneacion = (id) => {
        enrutamiento.push(`/ProduccionPlaneacion/${id}`);
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
            name: "Semana",
            selector: row => row.requerimiento.semana,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Producto",
            selector: row => (
                <>
                    <ProductosPedido
                        id={row.requerimiento.producto}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad total a producir",
            selector: row => row.requerimiento.totalProducir,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            center: true,
            reorder: false,
            selector: row =>
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                title="Deshabilitar"
                                className="editar"
                                onClick={() => {
                                    eliminaLogicaPlaneacion(
                                        <EliminacionLogicaPlaneacion
                                            datos={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />)
                                }}
                            >
                                Activa
                            </Badge>
                        </>
                    )
                    :
                    (
                        <>
                            <Badge
                                bg="danger"
                                title="Habilitar"
                                className="eliminar"
                            >
                                Cancelada
                            </Badge>
                        </>
                    )
        },
        {
            name: "Requisicion",
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="primary"
                                title="Generar una requsición"
                                className="editar"
                                onClick={() => {
                                    requisicionPlaneacion(row.id)
                                }}
                            >
                                Generar
                            </Badge>
                        </>
                    )
                    :
                    (
                        "No disponible"
                    )
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Orden producción",
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="primary"
                                title="Generar una orden de produción"
                                className="editar"
                                onClick={() => {
                                    produccionPlaneacion(row.id)
                                }}
                            >
                                Generar
                            </Badge>
                        </>
                    )
                    :
                    (
                        "No disponible"
                    )
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
                            modificaPedidoVenta(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        title="Eliminar"
                        onClick={() => {
                            eliminaPlaneacion(
                                <EliminacionFisicaPlaneacion
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
            setRows(listRequerimientosPlaneacion);
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

    // Defino barra de busqueda
    const ClearButton = styled(Button)` 
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        height: 34px;
        width: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const TextField = styled.input` 
        height: 32px;
        border-radius: 3px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: 1px solid #e5e5e5;
        padding: 0 32px 0 16px;
      &:hover {
        cursor: pointer;
      }
    `;

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    // actions={descargaCSV}
                    data={listRequerimientosPlaneacion}
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

export default ListProduccion;
