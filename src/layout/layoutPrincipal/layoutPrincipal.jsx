import { useState, useEffect, Fragment } from 'react';
import {
    getSucursal,
    getTokenApi,
    isExpiredToken,
    logoutApi,
    obtenidusuarioLogueado,
    setSucursal,
} from "../../api/auth";
import { map } from "lodash";
import {
    useNavigate
} from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import LogoFredherBlanco from "../../assets/png/logo-fredher-blanco.png";
import ImagenPerfil from "../../assets/png/user-avatar.png";
import { Button, Row, Container, Form, Image } from "react-bootstrap";
import "./layoutPrincipal.scss";
import { listarRazonSocialActiva } from "../../api/razonesSociales";
import { LogsInformativosLogout } from "../../components/Logs/LogsSistema/LogsSistema";

function LayoutPrincipal(props) {
    const { setRefreshCheckLogin, children } = props;

    const redirecciona = useNavigate();

    //Para cerrar la sesion
    const cerrarSesion = () => {
        LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
        logoutApi();
        redirecciona("");
        setRefreshCheckLogin(true);
        toast.success("Sesión cerrada");
    }

    // Para almacenar las sucursales registradas
    const [sucursalesRegistradas, setSucursalesRegistradas] = useState(null);

    useEffect(() => {
        try {
            listarRazonSocialActiva().then(response => {
                const { data } = response;
                //console.log(data)
                const dataTemp = formatModelSucursales(data);
                //console.log(data)
                setSucursalesRegistradas(dataTemp);
            })
        } catch (e) {

        }
    }, []);

    // Almacena la razón social, si ya fue elegida
    const [sucursalElegida, setSucursalElegida] = useState("");

    // Para almacenar en localstorage la razon social
    const almacenaSucursal = (sucursal) => {
        if (sucursal != "Selecciona una de las razones sociales registradas") {
            setSucursal(sucursal)
        }
        window.location.reload()
    }

    useEffect(() => {
        if (getSucursal()) {
            setSucursalElegida(getSucursal)
        }
    }, []);

    // Cerrado de sesión automatico
    useEffect(() => {
        if (getTokenApi()) {
            if (isExpiredToken(getTokenApi())) {
                LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                redirecciona("");
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    // Para ir hacia el inicio
    const rutaInicio = () => {
        redirecciona("/")
    }

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-800">
                    {({ open }) => (
                        <>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between h-16">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={LogoFredherBlanco}
                                                width="125px"
                                                alt="Workflow"
                                                className="logoPrincipal"
                                                onClick={() => {
                                                    rutaInicio()
                                                }}
                                            />
                                        </div>
                                        <div className="hidden sm:block sm:ml-72">
                                            {/* Informacion en el menu principal */}
                                            {/* Seleccionable con razones sociales */}
                                            <Form.Control
                                                as="select"
                                                aria-label="indicadorSucursal"
                                                className="cajaSucursal"
                                                name="sucursal"
                                                defaultValue={sucursalElegida}
                                                onChange={(e) => {
                                                    almacenaSucursal(e.target.value)
                                                }}
                                            >
                                                <option>Selecciona una de las razones sociales registradas</option>
                                                {map(sucursalesRegistradas, (sucursal, index) => (
                                                    <option key={index} value={sucursal?.nombre} selected={sucursalElegida == sucursal?.nombre}>{sucursal?.nombre}</option>
                                                ))}
                                            </Form.Control>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            <Button
                                                //type="button"
                                                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                            >
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </Button>

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="ml-3 relative">
                                                <div>
                                                    <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                        <span className="sr-only">Open user menu</span>
                                                        <Image className="h-8 w-8 rounded-full" src={ImagenPerfil} alt="" />
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        {({ active }) => (
                                                            <Button
                                                                onClick={() => {
                                                                    cerrarSesion()
                                                                }}
                                                                className="cerrarSesion"
                                                            >
                                                                Cerrar sesion
                                                            </Button>
                                                        )}
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="sm:hidden">
                                <div className="px-2 pt-2 pb-3 space-y-1">
                                    {/* Informacion en el menu principal */}
                                    {/* Seleccionable con razones sociales */}
                                    <Form.Control
                                        as="select"
                                        aria-label="indicadorSucursal"
                                        name="sucursal"
                                        className="cajaSucursal"
                                        defaultValue={sucursalElegida}
                                        onChange={(e) => {
                                            almacenaSucursal(e.target.value)
                                        }}
                                    >
                                        <option>Selecciona una de las sucursales registradas</option>
                                        {map(sucursalesRegistradas, (sucursal, index) => (
                                            <option key={index} value={sucursal?.nombre} selected={sucursalElegida == sucursal?.nombre}>{sucursal?.nombre}</option>
                                        ))}
                                    </Form.Control>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
                <Container fluid>
                    <Row>
                        {children}
                    </Row>
                </Container>
            </div>
        </>
    );
}

function formatModelSucursales(data) {
    //console.log(data)
    const dataTemp = []
    data.forEach(data => {
        const { direccion: { calle, numeroExterior, numeroInterior, colonia, municipio, estado, pais, otro } } = data;
        dataTemp.push({
            id: data._id,
            nombre: data.nombre,
            calle: calle,
            numeroExterior: numeroExterior,
            numeroInterior: numeroInterior,
            colonia: colonia,
            municipio: municipio,
            estado: estado,
            pais: pais,
            otro: otro,
            estadoSucursal: data.estadoSucursal,
            fechaCreacion: data.createdAt,
            fechaActualizacion: data.updatedAt
        });
    });
    return dataTemp;
}

export default LayoutPrincipal;