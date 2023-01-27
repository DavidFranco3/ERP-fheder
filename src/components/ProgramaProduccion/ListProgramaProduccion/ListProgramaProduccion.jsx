import { useState, useEffect, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import "./ListProgramaProduccion.scss"
import { Badge, Button, Container, Navbar, Table, Form, Col } from "react-bootstrap";
import BasicModal from '../../Modal/BasicModal';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { estilos } from "../../../utils/tableStyled";
import { exportCSVFile } from "../../../utils/exportCSV";
import EliminacionFisicaPrograma from '../EliminacionFisica';
import EstadoPrograma from '../EstadoPrograma';
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function ListProgramaProduccion(props) {
    const { listProgramaProduccion, history, location, setRefreshCheckLogin } = props;

    const enrutamiento = useHistory();

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de usuarios
    const eliminaPrograma = (content) => {
        setTitulosModal("Eliminando el programa de produccion");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaPrograma = (content) => {
        setTitulosModal("Cancelando el programa de produccion");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de datos
    const modificaRecepcion = (id) => {
        enrutamiento.push(`/ModificaProgramaProduccion/${id}`);
    }

    const columns = [
        {
            name: 'Folio',
            selector: row => row.folio,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Fecha de inicio',
            selector: row => dayjs(row.ordenProduccion.fechaInicio).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'OP',
            selector: row => row.folioOP,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Descripción',
            selector: row => row.ordenProduccion.nombreProducto,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Cantidad a fabricar',
            selector: row => row.ordenProduccion.cantidadFabricar,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Acumulado',
            selector: row => row.ordenProduccion.acumulado,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Pendiente de fabricar',
            selector: row => row.ordenProduccion.pendienteFabricar,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Ciclo',
            selector: row => row.ordenProduccion.ciclo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Cav',
            selector: row => row.ordenProduccion.cavidades,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Turnos req',
            selector: row => row.ordenProduccion.turnosRequeridos,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Operadores',
            selector: row => row.ordenProduccion.operadores,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'No. interno',
            selector: row => row.ordenProduccion.noInterno,
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
                                    eliminaLogicaPrograma(
                                        <EstadoPrograma
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
                                cancelado
                            </Badge>
                        </>
                    )
        },
        {
            name: 'Lunes T1',
            selector: row => dayjs(row.programa.lunesT1).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Lunes T2',
            selector: row => dayjs(row.programa.lunesT2).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Martes T1',
            selector: row => dayjs(row.programa.martesT1).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Martes T2',
            selector: row => dayjs(row.programa.martesT2).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Miercoles T1',
            selector: row => dayjs(row.programa.miercolesT1).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Miercoles T2',
            selector: row => dayjs(row.programa.miercolesT2).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Jueves T1',
            selector: row => dayjs(row.programa.juevesT1).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Jueves T2',
            selector: row => dayjs(row.programa.juevesT2).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Viernes T1',
            selector: row => dayjs(row.programa.viernesT1).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Viernes T2',
            selector: row => dayjs(row.programa.viernesT2).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Sabado T1',
            selector: row => dayjs(row.programa.sabadoT1).format("LL"),
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
                            eliminaPrograma(
                                <EliminacionFisicaPrograma
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
            setRows(listProgramaProduccion);
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

    const descargaCSV = useMemo(() => <Export onExport={() => exportCSVFile(headers, listProgramaProduccion, "USUARIOS")} />, []);

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


    const filteredItems = listProgramaProduccion.filter(
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
                    data={listProgramaProduccion}
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

export default ListProgramaProduccion;
