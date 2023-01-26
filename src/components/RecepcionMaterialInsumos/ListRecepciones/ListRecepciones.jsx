import { useState, useEffect, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import "./ListRecepciones.scss"
import { Badge, Button, Container, Navbar, Table, Form, Col } from "react-bootstrap";
import BasicModal from '../../Modal/BasicModal';
import EliminacionFisicaRecepcion from '../EliminacionFisica';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import { exportCSVFile } from "../../../utils/exportCSV";
import ListProductosRecepcion from '../ListProductosRecepcion';
import EliminacionLogicaRecepcion from '../EliminacionLogica';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListRecepciones(props) {
    const { listRecepciones, history, location, setRefreshCheckLogin } = props;

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    const enrutamiento = useHistory();

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de usuarios
    const eliminaUsuarios = (content) => {
        setTitulosModal("Eliminando la recepcion");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaRecepcion = (content) => {
        setTitulosModal("Cancelando la recepción de materiales e insumos");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de datos
    const modificaRecepcion = (id) => {
        enrutamiento.push(`/ModificaRecepcion/${id}`);
    }

    const ExpandedComponent = ({ data }) => (
        <ListProductosRecepcion
            numeroRecepcion={data.folio}
        />
    );

    const columns = [
        {
            name: 'Folio',
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Orden de compra',
            selector: row => row.ordenCompra,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Proveedor',
            selector: row => row.nombreProveedor,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Fecha de recepción',
            selector: row => dayjs(row.fechaRecepcion).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Precio',
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.precio)} MXN
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Cantidad elementos',
            selector: row => row.cantidad,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Total',
            selector: row => (
                <>
                    ${''}
                    {new Intl.NumberFormat('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(row.valorTotal)} MXN
                </>
            ),
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
                                    eliminaLogicaRecepcion(
                                        <EliminacionLogicaRecepcion
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
                                Cancelado
                            </Badge>
                        </>
                    )
        },
        {
            name: 'Acciones',
            center: true,
            reorder: false,
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
                            modificaRecepcion(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        title="Eliminar"
                        className="eliminar"
                        onClick={() => {
                            eliminaUsuarios(
                                <EliminacionFisicaRecepcion
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
            setRows(listRecepciones);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    const Export = ({ onExport }) => (
        <>
            <Button onClick={
                e => onExport(e.target.value)
            }>Descargar CSV</Button>
        </>
    );

    const headers = {
        id: "ID",
        nombre: "Nombre",
        apellidos: "Apellidos",
        curp: "CURP",
        nss: "NSS",
        rfc: "RFC",
        telefonoCelular: "Telefono celular",
        telefonoFijo: "Telefono fijo",
        calle: "Calle",
        numeroExterior: "Numero exterior",
        numeroInterior: "Numero interior",
        colonia: "Colonia",
        municipio: "Municipio",
        estado: "Estado",
        pais: "Pais",
        departamento: "Departamento",
        correo: "Correo",
        password: "Contraseña",
        foto: "foto",
        estadoUsuario: "Estado Usuario",
        fechaCreacion: "Fecha de registro",
        fechaActualizacion: "Fecha actualizcion"
    };

    const descargaCSV = useMemo(() => <Export onExport={() => exportCSVFile(headers, listRecepciones, "USUARIOS")} />, []);

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


    const filteredItems = listRecepciones.filter(
        item => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase())
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
                <Col sm="2">
                    <Form.Control
                        id="search"
                        type="text"
                        placeholder="Busqueda por nombre"
                        aria-label="Search Input"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </Col>
                <ClearButton type="button" onClick={handleClear}>
                    X
                </ClearButton>
            </>
        );
    }, [filterText]);

    return (
        <>
            <Container fluid>
                <DataTable
                    noDataComponent="No hay registros para mostrar"
                    columns={columns}
                    data={listRecepciones}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    //actions={descargaCSV}
                    //subHeader
                    //subHeaderComponent={subHeaderComponentMemo}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListRecepciones;
