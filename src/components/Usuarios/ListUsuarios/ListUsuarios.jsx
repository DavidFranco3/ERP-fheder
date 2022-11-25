import { useState, useEffect, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import moment from "moment";
import 'moment/locale/es';

import "./ListUsuarios.scss"
import { Badge, Button, Container, Navbar, Table, Form, Col } from "react-bootstrap";
import { map } from "lodash";
import EliminacionLogicaUsuarios from "../EliminacionLogica";
import BasicModal from "../../Modal/BasicModal";
import EliminacionFisicaUsuarios from "../EliminacionFisica";

import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import TableRow from "@mui/material/TableRow";
import { estilos } from "../../../utils/tableStyled";
import { exportCSVFile } from "../../../utils/exportCSV";

function ListUsuarios(props) {
    const { listUsuarios, history, location, setRefreshCheckLogin, rowsPerPage, setRowsPerPage, page, setPage, noTotalUsuarios } = props;

    const enrutamiento = useHistory();

    //console.log(listUsuarios)

    moment.locale("es");

    // Para hacer uso del modal
    const [showModal, setShowModal] = useState(false);
    const [contentModal, setContentModal] = useState(null);
    const [titulosModal, setTitulosModal] = useState(null);

    //Para la eliminacion fisica de usuarios
    const eliminaUsuarios = (content) => {
        setTitulosModal("Eliminando el usuario");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const eliminaLogicaUsuarios = (content) => {
        setTitulosModal("Deshabilitando usuario");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la eliminacion logica de usuarios
    const habilitaUsuarios = (content) => {
        setTitulosModal("Habilitando usuario");
        setContentModal(content);
        setShowModal(true);
    }

    //Para la modificacion de datos
    const modificaUsuarios = (id) => {
        enrutamiento.push(`/ModificacionUsuarios/${id}`);
    }

    // Definicion de tabla
    //const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre + " " + row.apellidos,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'CURP',
            selector: row => row.curp,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'NSS',
            selector: row => row.nss,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'RFC',
            selector: row => row.rfc,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Telefono celular',
            selector: row => row.telefonoCelular,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Departamento',
            selector: row => row.departamento,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Modificación',
            selector: row => moment(row.fechaActualizacion).format("LL"),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Estado',
            center: true,
            reorder: false,
            selector: row =>
                row.estadoUsuario === "true" ?
                    (
                        <>
                            <Badge
                                bg="success"
                                className="editar"
                                onClick={() => {
                                    eliminaLogicaUsuarios(
                                        <EliminacionLogicaUsuarios
                                            dataUsuario={row}
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
                                className="eliminar"
                                onClick={() => {
                                    habilitaUsuarios(
                                        <EliminacionLogicaUsuarios
                                            dataUsuario={row}
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
            name: 'Acciones',
            center: true,
            reorder: false,
            selector: row => (
                <>
                    <Badge
                        bg="success"
                        className="editar"
                        onClick={() => {
                            modificaUsuarios(row.id)
                        }}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} className="text-lg" />
                    </Badge>
                    <Badge
                        bg="danger"
                        className="eliminar"
                        onClick={() => {
                            eliminaUsuarios(
                                <EliminacionFisicaUsuarios
                                    dataUsuario={row}
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
            setRows(listUsuarios);
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

    const descargaCSV = useMemo(() => <Export onExport={() => exportCSVFile(headers, listUsuarios, "USUARIOS")} />, []);

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


    const filteredItems = listUsuarios.filter(
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

    const handleChangePage = (page) => {
        // console.log("Nueva pagina "+ newPage)
        setPage(page);
    };

    const handleChangeRowsPerPage = (newPerPage) => {
        // console.log("Registros por pagina "+ parseInt(event.target.value, 10))
        setRowsPerPage(newPerPage)
        //setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    //actions={descargaCSV}
                    //subHeader
                    //subHeaderComponent={subHeaderComponentMemo}
                    progressPending={pending}
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationServer
                    paginationTotalRows={noTotalUsuarios}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    onChangePage={handleChangePage}
                />
            </Container>

            <BasicModal show={showModal} setShow={setShowModal} title={titulosModal}>
                {contentModal}
            </BasicModal>
        </>
    );
}

export default ListUsuarios;
