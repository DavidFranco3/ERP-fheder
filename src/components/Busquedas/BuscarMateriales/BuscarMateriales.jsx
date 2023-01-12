import { useState, useEffect, useMemo } from 'react';
import { Row, Col, Container, Form, Button, Spinner } from "react-bootstrap"
import moment from "moment";
//import NombreCliente from "../../ListTracking/NombreCliente";
import { map } from "lodash";
import "./BuscarMateriales.scss"
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { estilos } from "../../../utils/tableStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong, faCircleInfo, faPenToSquare, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { obtenerMateriaPrima } from "../../../api/materiaPrima";
import { toast } from "react-toastify";

function BuscarMateriales(props) {
    const { setFormData, formData, setShowModal, listMateriales } = props;
    // console.log(ordenVenta)

    // Para almacenar la informacion del formulario
    const [clienteSeleccionado, setClienteSeleccionado] = useState(initialFormData());

    // Para almacenar la informacion del formulario
    const [valoresCliente, setValoresCliente] = useState(initialValues());

    // Para controlar la animacion
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        try {

            obtenerMateriaPrima(clienteSeleccionado.seleccion).then(response => {
                const { data } = response;
                const { cliente, nombreCliente, fechaElaboracion, fechaEntrega, productos } = data;
                setValoresCliente(valoresAlmacenados(data))
            }).catch(e => {
                console.log(e)
            })

        } catch (e) {
            console.log(e)
        }
    }, [clienteSeleccionado.seleccion]);

    // Cancelar y cerrar el formulario
    const cancelarBusqueda = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setClienteSeleccionado({ ...clienteSeleccionado, [e.target.name]: e.target.value })
    }

    const onSubmit = e => {
        //e.preventDefault();
        if (!clienteSeleccionado.seleccion) {
            toast.warning("Selecciona un registro")
        } else {
            //setNombreCliente()
            //console.log(formData)
            setLoading(true);
            const dataTemp = {
                folio: valoresCliente.folio,
                idMaterial: valoresCliente.idMaterial,
                descripcion: valoresCliente.descripcion,
                um: valoresCliente.um,
                proveedor: valoresCliente.proveedor,
                precioUnitario: valoresCliente.precio,

                idArticulo: valoresCliente.idMaterial,
                folioArticulo: valoresCliente.folio,
                nombreArticulo: valoresCliente.descripcion,
                umMaterial: valoresCliente.umMaterial,

                nombreProducto: valoresCliente.nombreProducto,
                folioProdcuto: valoresCliente.folioProdcuto,

                idPigmento: valoresCliente.idPigmento,
                folioPigmento: valoresCliente.folioPigmento,
                descripcionPigmento: valoresCliente.descripcionPigmento,
                precioPigmento: valoresCliente.precioPigmento,
                umPigmento: valoresCliente.umPigmento,

                idEmpaque: valoresCliente.idEmpaque,
                folioEmpaque: valoresCliente.folioEmpaque,
                descripcionEmpaque: valoresCliente.descripcionEmpaque,
                precioEmpaque: valoresCliente.precioEmpaque,
                umEmpaque: valoresCliente.umEmpaque
            }
            setFormData(dataTemp)
            setShowModal(false);
        }
    }

    console.log(valoresCliente)

    const columns = [
        {
            name: 'Folio',
            selector: row => (
                <>
                    <Form.Group as={Row} controlId="formHorizontalNoInterno">
                        <Col>
                            <Form.Check
                                value={row.id}
                                type="radio"
                                //label="Paletizado"
                                name="seleccion"
                                onChange={onChange}
                                id={row.id}
                                defaultValue={clienteSeleccionado.seleccion}
                            />
                        </Col>
                        <Col>
                            {row.folio}
                        </Col>
                    </Form.Group>
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'Nombre',
            selector: row => row.descripcion,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: 'UM',
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
            name: 'Proveedor',
            selector: row => row.proveedor,
            sortable: false,
            center: true,
            reorder: false
        },
    ];

    // Configurando animacion de carga
    const [pending, setPending] = useState(true);
    const [rows, setRows] = useState([]);


    useEffect(() => {
        const timeout = setTimeout(() => {
            setRows(listMateriales);
            setPending(false);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const paginationComponentOptions = {
        rowsPerPageText: 'Filas por página',
        rangeSeparatorText: 'de'
    };

    // Procesa documento para descargar en csv
    function convertArrayOfObjectsToCSV(array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(filteredItems[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;
        const filename = 'Datos.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }
        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Descargar CSV</Button>;

    const descargaCSV = useMemo(() => <Export onExport={() => downloadCSV(filteredItems)} />, []);

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


    const filteredItems = listMateriales.filter(
        item => item.descripcion && item.descripcion.toLowerCase().includes(filterText.toLowerCase())
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
                        placeholder="Busqueda por nombre del material"
                        aria-label="Search Input"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </Col>
                <Col>
                    <ClearButton
                        title="Limpiar busqueda"
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
                            variant="success"
                            title="Usar el registro seleccionado"
                            className="registrar"
                            onClick={() => {
                                onSubmit()
                            }}

                        >
                            {!loading ? "Seleccionar" : <Spinner animation="border" />}
                        </Button>
                    </Col>
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

function initialFormData() {
    return {
        seleccion: ""
    }
}

function initialValues() {
    return {
        idMaterial: "",
        folio: "",
        descripcion: "",
        um: "",
        proveedor: "",
        precio: "",
        nombreProducto: "",
        folioProdcuto: "",
        umMaterial: "",

        idPigmento: "",
        folioPigmento: "",
        descripcionPigmento: "",
        precioPigmento: "",
        umPigmento: "",

        idEmpaque: "",
        folioEmpaque: "",
        descripcionEmpaque: "",
        precioEmpaque: "",
        umEmpaque: ""
    }
}

function valoresAlmacenados(data) {
    return {
        idMaterial: data._id,
        folio: data.folio,
        descripcion: data.descripcion,
        um: data.um,
        proveedor: data.proveedor,
        precio: data.precio,
        nombreProducto: data.descripcion,
        folioProdcuto: data.folio,
        umMaterial: data.um,

        idPigmento: data._id,
        folioPigmento: data.folio,
        descripcionPigmento: data.descripcion,
        precioPigmento: data.precio,
        umPigmento: data.um,

        idEmpaque: data._id,
        folioEmpaque: data.folio,
        descripcionEmpaque: data.descripcion,
        precioEmpaque: data.precio,
        umEmpaque: data.um,
    }
}

export default BuscarMateriales;
