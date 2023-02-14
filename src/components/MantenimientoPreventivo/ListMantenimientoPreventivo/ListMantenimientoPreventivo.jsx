import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Badge, Container } from "react-bootstrap";
import BasicModal from "../../Modal/BasicModal";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faTrashCan, faPenToSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import "./ListMantenimientoPreventivo.scss";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import EliminacionLogicaMantenimientoPreventivo from '../EliminacionLogica';
import EliminacionFisicaMantenimientoPreventivo from '../EliminacionFisica';
import ModificaMantenimientoPreventivo from '../ModificaMantenimientoPreventivo';

function ListMantenimientoPreventivo(props) {
    const { setRefreshCheckLogin, listMantenimientos, history, location } = props;

    const enrutamiento = useNavigate();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Para la eliminacion fisica de usuarios
    const eliminacionMantenimiento = (content) => {
        setTitulosModal("Eliminar");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaMantenimiento = (content) => {
        setTitulosModal("Cancelando el programa de mantenimiento preventivo");
        setContentModal(content);
        setShowModal(true);
    }
    // Para la eliminacion fisica de usuarios
    const modificacionMantenimiento = (content) => {
        setTitulosModal("Modificar");
        setContentModal(content);
        setShowModal(true);
    }

    // Para abrir en una pestaña nueva el pdf de la vista
    const vistaPrevia = () => {
        // enrutamiento("")
    }

    const columns = [
        {
            name: "Item",
            selector: row => row.item,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Ident",
            selector: row => row.ident,
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
            name: "Semana 1",
            selector: row => row.fechasProgramadas.semana1,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Semana 2",
            selector: row => row.fechasProgramadas.semana2,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Semana 3",
            selector: row => row.fechasProgramadas.semana3,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Semana 4",
            selector: row => row.fechasProgramadas.semana4,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Real semana 1",
            selector: row => row.fechasReales.semana1,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Real semana 2",
            selector: row => row.fechasReales.semana2,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Real semana 3",
            selector: row => row.fechasReales.semana3,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Real semana 4",
            selector: row => row.fechasReales.semana4,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Comentarios",
            selector: row => row.comentarios,
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
                                    eliminaLogicaMantenimiento(
                                        <EliminacionLogicaMantenimientoPreventivo
                                            datos={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />)
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
                                title="Habilitar"
                                className="eliminar"
                            >
                                Cancelado
                            </Badge>
                        </>
                    )
        },
        {
            name: "Ultima modificación",
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
                        bg="success"
                        title="Modificar"
                        className="editar"
                        onClick={() => {
                            modificacionMantenimiento(
                                <ModificaMantenimientoPreventivo
                                    datos={row}
                                    setShowModal={setShowModal}
                                    history={history}
                                />)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminacionMantenimiento(
                                <EliminacionFisicaMantenimientoPreventivo
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
            setRows(listMantenimientos);
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
                    data={listMantenimientos}
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

export default ListMantenimientoPreventivo;
