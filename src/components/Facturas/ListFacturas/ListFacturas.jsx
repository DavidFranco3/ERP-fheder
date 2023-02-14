import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge, Button, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListFacturas.scss";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import EliminacionLogicaFacturas from '../EliminacionLogica';
import EliminacionFisicaFacturas from '../EliminacionFisica';
import ListProductosFacturas from '../ListProductosFacturas';

function ListFacturas(props) {
    const { setRefreshCheckLogin, listFacturas, history, location } = props;

    const enrutamiento = useNavigate();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminaFactura = (content) => {
        setTitulosModal("Eliminando factura");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaFactura = (content) => {
        setTitulosModal("Cancelando la factura");
        setContentModal(content);
        setShowModal(true);
    }


    // Para la modificacion de datos del pedido
    const modificaFactura = (id) => {
        enrutamiento(`/ModificaFacturas/${id}`);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = (id) => {
        enrutamiento(`/VistaPreviaFactura/${id}`);
    }

    const ExpandedComponent = ({ data }) => (
        <ListProductosFacturas
            folio={data.folio}
        />
    );

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Orden de venta",
            selector: row => row.ordenVenta,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cliente",
            selector: row => row.nombreCliente,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre de contacto",
            selector: row => row.nombreContacto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Telefono",
            selector: row => row.telefono,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Correo",
            selector: row => row.correo,
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
                                    eliminaLogicaFactura(
                                        <EliminacionLogicaFacturas
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
            name: "Fecha emisión",
            selector: row => dayjs(row.fechaEmisión).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha vencimiento",
            selector: row => dayjs(row.fechaVencimiento).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="primary"
                        title="Generar PDF"
                        className="ver"
                        onClick={() => {
                            vistaPrevia(row.id);
                        }}
                    >
                        <FontAwesomeIcon icon={faEye} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="success"
                        title="Modificar"
                        className="editar"
                        onClick={() => {
                            modificaFactura(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaFactura(
                                <EliminacionFisicaFacturas
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
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listFacturas);
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
                    data={listFacturas}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
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

export default ListFacturas;
