import { useState, useEffect, useMemo } from 'react';
import BasicModal from "../../Modal/BasicModal";
import { useHistory } from "react-router-dom";
import "./ListAlmacenes.scss"
import { Badge, Container, Button, Col, Form } from "react-bootstrap";
import EliminaAlmacenes from '../EliminaAlmacenes';
import ModificarAlmacenes from '../ModificarAlmacenes';
import CambiarEstadoAlmacenes from '../CambiarEstadoAlmacenes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { map } from "lodash";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListAlmacenMp(props) {
    const { listAlmacenes, location, history, setRefreshCheckLogin } = props;

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // define el uso del enrutamiento
    const enrutamiento = useHistory()

    // Para el modal de eliminación de materias primas
    const eliminacionAlmacenes = (content) => {
        setTitulosModal("Eliminando el articulo");
        setContentModal(content);
        setShowModal(true);
    }

    // Para editar los detalles de la materia prima que esta en almacen
    const modificarAlmacenes = (content) => {
        setTitulosModal("Modificando");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de clientes
    const eliminaLogicaArticulos = (content) => {
        setTitulosModal("Deshabilitando articulo");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de clientes
    const habilitaArticulos = (content) => {
        setTitulosModal("Habilitando articulo");
        setContentModal(content);
        setShowModal(true);
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
            name: "Articulo",
            selector: row => row.nombreArticulo,
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
            name: "UM",
            selector: row => row.um,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Tipo",
            selector: row => row.tipo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Cantidad E/S",
            selector: row => row.cantidadExistencia,
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
            name: "Fecha del movimiento",
            selector: row => dayjs(row.fecha).format('LL'),
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
                                className="editarProveedor"
                                title="Modificar"
                                onClick={() => {
                                    modificarAlmacenes(
                                        <ModificarAlmacenes
                                            datos={row}
                                            setShowModal={setShowModal}
                                            location={location}
                                            history={history}
                                        />
                                    )
                                }}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                            </Badge>
                            <Badge
                                bg="danger"
                                className="eliminarProveedor"
                                title="Eliminar"
                                onClick={() => {
                                    eliminacionAlmacenes(
                                        <EliminaAlmacenes
                                            datos={row}
                                            setShowModal={setShowModal}
                                            location={location}
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

    // Definiendo estilos para data table
    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listAlmacenes);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de',
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


    const filteredItems = listAlmacenes.filter(
        item => filterText == "" ? item.nombreArticulo.toLowerCase().includes(filterText.toLowerCase()) : item.nombreArticulo == filterText
    );

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToogle(!resetPaginationToogle);
                setFilterText('');
            }
        };

        return (
            <>
                <Col></Col>
                <Col>
                    <div className="flex items-center mb-1">
                        <Form.Control
                            id="search"
                            type="text"
                            placeholder="Busqueda por nombre del articulo"
                            aria-label="Search Input"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                        />
                        <ClearButton
                            type="button"
                            variant="info"
                            title="Limpiar la busqueda"
                            onClick={handleClear}>
                            X
                        </ClearButton>
                    </div>
                </Col>
                <Col></Col>
            </>
        );
    }, [filterText, resetPaginationToogle]);

    const [totalEntrada, setTotalEntrada] = useState(0);

    let cantidadTotalEntrada = 0;

    const [totalSalida, setTotalSalida] = useState(0);

    let cantidadTotalSalida = 0;


    useEffect(() => {
        map(filteredItems, (articulos, index) => {
            const { estado, cantidadExistencia, tipo } = articulos
            if (estado == "true") {
                if (tipo == "Entrada") {
                    cantidadTotalEntrada += parseFloat(cantidadExistencia);
                } else if (tipo == "Salida") {
                    cantidadTotalSalida += parseFloat(cantidadExistencia);
                }
            }
            setTotalEntrada(cantidadTotalEntrada)
            setTotalSalida(cantidadTotalSalida)
        })
    }, [filteredItems]);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    data={filteredItems}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
                Existencias de articulos: {parseFloat(totalEntrada - totalSalida)}
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListAlmacenMp;
