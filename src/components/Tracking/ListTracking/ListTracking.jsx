import { useState, useEffect, useMemo } from 'react';
import { Badge, Button, Container, Row, Col, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import Graficador from "../Graficador";
import { Tab } from '@headlessui/react'
import "./ListTracking.scss"
import NombreCliente from "./NombreCliente";
import OrdenVenta from "../Procesos/OrdenVenta";
import Planeacion from "../Procesos/Planeacion";
import Compras from "../Procesos/Compras";
import Calidad from "../Procesos/Calidad";
import Produccion from "../Procesos/Produccion";
import AlmacenPT from "../Procesos/AlmacenPT";
import AlmacenMP from "../Procesos/AlmacenMP";
import Embarques from "../Procesos/Embarques";
import Facturacion from "../Procesos/Facturacion";
import CuentasxCobrar from "../Procesos/CuentasxCobrar";
import { estilos } from "../../../utils/tableStyled";
import 'dayjs/locale/es'
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function ListTracking(props) {
    const { listTracking, setRefreshCheckLogin, history, location } = props;
    //console.log(listTracking)

    dayjs.locale('es') // use Spanish locale globally
    dayjs.extend(localizedFormat)

    // Definicion de tabla
    const ExpandedComponent = ({ data }) => (
        <>
            {/* Indicador para el rastreo campo clave -- data.ordenVenta */}
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Orden de venta
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Planeación
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Compras
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Calidad
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Almacen MP
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Producción
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Almacen PT
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Embarques
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Facturación
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-zinc-900',
                                'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-zinc-900 hover:bg-white/[0.8] hover:text-zinc-600'
                            )
                        }
                    >
                        Cuentas por cobrar
                    </Tab>
                </Tab.List>
                {/* Listado de cada pestaña, su contenido esta aqui */}
                <Tab.Panels className="mt-2">
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <OrdenVenta
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Planeacion
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Compras
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Calidad
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <AlmacenMP
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Produccion
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <AlmacenPT
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Embarques
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <Facturacion
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                    <Tab.Panel
                        className={classNames(
                            'rounded-xl bg-white p-3',
                            'focus:outline-none ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:ring-2'
                        )}
                    >
                        <CuentasxCobrar
                            ordenVenta={data.ordenVenta}
                        />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    );

    const columns = [
        {
            name: "ITEM",
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
            selector: row => (
                <>
                    <NombreCliente
                        folio={row.cliente}
                    />
                </>
            ),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de elaboración",
            selector: row => dayjs(row.fechaElaboracion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Fecha de entrega",
            sortable: false,
            center: true,
            reorder: false,
            selector: row => dayjs(row.fechaEntrega).format('LL')
        },
        {
            name: "Última modificación",
            selector: row => dayjs(row.fechaActualizacion).format('LL'),
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Proceso",
            selector: row => row.status,
            sortable: false,
            center: true,
            reorder: false
        },
        {
            name: "Status",
            selector: row => (
                <>
                    <div className="graficador">
                        <Graficador
                            indicador={row.indicador}
                            status={row.status}
                        />
                    </div>
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
            setRows(listTracking);
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

    const [resetPaginationToogle, setResetPaginationToogle] = useState(true);

    return (
        <>
            <Container fluid>
                <DataTable
                    columns={columns}
                    noDataComponent="No hay registros para mostrar"
                    // actions={descargaCSV}
                    data={listTracking}
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
        </>
    );
}

export default ListTracking;
