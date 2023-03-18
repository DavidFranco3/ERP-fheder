import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Container, Form, Button, Spinner } from "react-bootstrap"
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import "./BuscarCuentasPagar.scss"
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import ListCuentasPagar from '../../CuentasPagar/ListCuentasPagar';

function BuscarCuentasPagar(props) {
    const { setFormData, setShowModal, listCuentasPagar } = props;

    console.log(listCuentasPagar)

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }

    // Gestionar el socio seleccionado
    const facturaElegida = ({ folio, ivaElegido, subtotal, total, proveedor, nombreProveedor }) => {
        // Almacena id, ficha y nombre del socio elegido
        const dataTemp = {
            factura: folio,
            ivaElegido: ivaElegido,
            subtotal: subtotal,
            total: total,
            proveedor: proveedor,
            nombreProveedor: nombreProveedor,
        }
        setFormData(dataTemp);
        cancelarBusqueda();
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
            name: "Orden de compra",
            selector: row => row.ordenCompra,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Proveedor",
            selector: row => row.nombreProveedor,
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
            name: "Seleccionar",
            selector: row => (
                <>
                    <FontAwesomeIcon
                        className="eleccion"
                        icon={faCircleCheck}
                        onClick={() => {
                            facturaElegida(row);
                        }}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);

    const cargarDatos = () => {
        const timeout = setTimeout(() => {
            setRows(listCuentasPagar);
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

    const filteredItems = rows.filter(
        item => item.nombreProveedor && item.nombreProveedor.toLowerCase().includes(filterText.toLowerCase())
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
                <Col>
                    <Form.Control
                        id="search"
                        type="text"
                        placeholder="Busqueda por nombre del proveedor"
                        aria-label="Search Input"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </Col>
                <Col>
                    <ClearButton
                        title="Limpiar la busqueda"
                        type="button"
                        onClick={handleClear}>
                        X
                    </ClearButton>
                </Col>
            </>
        );
    }, [filterText, resetPaginationToogle]);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    noDataComponent="No hay registros para mostrar"
                    //actions={descargaCSV}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    progressPending={pending}
                    customStyles={estilos}
                    sortIcon={<FontAwesomeIcon icon={faArrowDownLong} />}
                    pagination
                    paginationComponentOptions={paginationComponentOptions}
                    paginationResetDefaultPage={resetPaginationToogle}
                />
                <Form.Group as={Row} className="botones">
                    <Col>
                        <Button
                            variant="danger"
                            title="Cerrar el formulario"
                            className="cancelar"
                            onClick={() => {
                                cancelarBusqueda()
                            }}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Form.Group>

            </Container>
        </>
    );
}

export default BuscarCuentasPagar;
