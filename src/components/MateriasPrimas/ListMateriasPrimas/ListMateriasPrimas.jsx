import { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import BasicModal from "../../Modal/BasicModal";
import { Badge, Container } from "react-bootstrap";
import EliminaMateriasPrimas from "../EliminaMateriasPrimas";
import ModificaMateriasPrimas from "../ModificaMateriasPrimas";
import { estilos } from "../../../utils/tableStyled";
import EliminacionLogicaMateriales from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListMateriasPrimas(props) {
    const { setRefreshCheckLogin, listMateriales, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion de materiales
    const eliminaMaterial = (content) => {
        setTitulosModal("Eliminando el material");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaMaterial = (content) => {
        setTitulosModal("Deshabilitando el material");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const habilitaMaterial = (content) => {
        setTitulosModal("Habilitando el material");
        setContentModal(content);
        setShowModal(true);
    }

    //Para editar la informacion del material
    const cambiaInformacionMaterial = (content) => {
        setTitulosModal("Actualizando datos");
        setContentModal(content);
        setShowModal(true);
    }

    const columns = [
        {
            name: "Folio",
            selector: row => row.folio,
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
            name: "UM",
            selector: row => row.um,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Precio",
            selector: row => (
                <>
                    {row.precio ? new Intl.NumberFormat('es-MX', {
                        style: "currency",
                        currency: "MXN"
                    }).format(row.precio) : "No disponible"}
                    { } MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Proveedor",
            selector: row => row.proveedor,
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
                                    eliminaLogicaMaterial(
                                        <EliminacionLogicaMateriales
                                            dataMaterial={row}
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
                                onClick={() => {
                                    habilitaMaterial(
                                        <EliminacionLogicaMateriales
                                            dataMaterial={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                Inactivo
                            </Badge>
                        </>
                    )
        },
        {
            name: "Ultima modificacion",
            selector: row => dayjs(row.fechaAdquisicion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                row.estado === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="editar"
                                onClick={() => {
                                    cambiaInformacionMaterial(
                                        <ModificaMateriasPrimas
                                            dataMateriaPrima={row}
                                            location={location}
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
                                title="Eliminar"
                                className="eliminar"
                                onClick={() => {
                                    eliminaMaterial(
                                        <EliminaMateriasPrimas
                                            dataMaterial={row}
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
                    :
                    (
                        "No disponibles"
                    )
            )
        }
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos  = () => {
        const timeout = setTimeout(() => {
            setRows(listMateriales);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }

    useEffect(() => {
        cargarDatos();
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
                    data={listMateriales}
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

export default ListMateriasPrimas;
