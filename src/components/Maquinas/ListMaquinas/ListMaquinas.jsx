import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BasicModal from "../../Modal/BasicModal";
import { Badge, Button, Container, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import EliminacionFisicaMaquinas from '../EliminacionFisica';
import ModificaMaquinas from '../ModificaMaquinas';
import EliminacionLogicaMaquinas from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListMaquinas(props) {
    const { setRefreshCheckLogin, listMaquinas, history, location } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    // Configura el enrutamiento
    const enrutamiento = useNavigate();

    //Para la eliminacion de compras
    const eliminacionMaquina = (content) => {
        setTitulosModal("Eliminando maquina");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const modifcaMaquina = (content) => {
        setTitulosModal("Modificando la maquina");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion de compras
    const cambiaEstadoMaquina = (content) => {
        setTitulosModal("Cambiando estado de la maquina");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de compras
    const modificacionCompraAlmacen = (folio) => {
        enrutamiento(`/Compras/AlmacenMP/Modificacion/${folio}`)
    }

    const modificacionCompra = (folio) => {
        enrutamiento(`/ModificacionCompras/${folio}`)
    }

    const columns = [
        {
            name: "# Maquina",
            selector: row => row.numeroMaquina,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo",
            selector: row => row.tipoMaquina,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Nombre",
            selector: row => row.nombre,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Marca",
            selector: row => row.marca,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Modelo",
            selector: row => row.modelo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "# Serie",
            selector: row => row.noSerie,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Donde se encuentra",
            selector: row => row.lugar,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Estado",
            selector: row => row.status === "true" ?
                (
                    <>
                        <Badge
                            bg="success"
                            className="activo"
                            title="Deshabilitar"
                            onClick={() => {
                                cambiaEstadoMaquina(
                                    <EliminacionLogicaMaquinas
                                        data={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
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
                            className="obsoleto"
                            title="Habilitar"
                            onClick={() => {
                                cambiaEstadoMaquina(
                                    <EliminacionLogicaMaquinas
                                        data={row}
                                        location={location}
                                        history={history}
                                        setShowModal={setShowModal}
                                    />
                                )
                            }}
                        >
                            Fuera de servicio
                        </Badge>
                    </>
                ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de adquisición",
            selector: row => dayjs(row.fechaAdquisicion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Acciones",
            center: true,
            reorder: true,
            selector: row => (
                row.status === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                title="Modificar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    modifcaMaquina(
                                        <ModificaMaquinas
                                            data={row}
                                            setShowModal={setShowModal}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                title="Eliminar"
                                className="eliminarProveedor"
                                onClick={() => {
                                    eliminacionMaquina(
                                        <EliminacionFisicaMaquinas
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

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listMaquinas);
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
                    data={listMaquinas}
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

export default ListMaquinas;
