import {useState, useEffect, Fragment} from 'react';
import "./MenuDepartamentos.scss"
import {Link, useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import {getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado} from "../../../api/auth";
import {obtenerUsuario} from "../../../api/usuarios";
import {Disclosure, Menu, Transition} from "@headlessui/react";
import LogoFredherBlanco from "../../../assets/png/logo-fredher-blanco.png";
import {BellIcon, MenuIcon, XIcon} from "@heroicons/react/outline";
import ImagenPerfil from "../../../assets/png/user-avatar.png";
import {Button} from "react-bootstrap";
import {scaleRotate as MenuEscala} from "react-burger-menu";
import {LogsInformativos, LogsInformativosLogout} from "../../Logs/LogsSistema/LogsSistema";

function MenuDepartamentos(props) {
    const { setRefreshCheckLogin } = props;
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    // Datos para el menu incluido aqui
    const redirecciona = useHistory();

    //Para cerrar la sesion
    const cerrarSesion = () => {
        LogsInformativosLogout("Sesión finalizada", setRefreshCheckLogin)
        redirecciona.push("")
        //logoutApi();
        setRefreshCheckLogin(true);
        toast.success("Sesión cerrada");
    }

    // Para ir hacia la ruta de inicio
    const rutaInicio = () => {
        redirecciona.push("/")
    }

    const [estadoUsuario, setEstadoUsuario] = useState("");

    // Cerrado de sesión automatico
    useEffect(() => {
        if(getTokenApi()) {
            if(isExpiredToken(getTokenApi())) {
                toast.warning("Sesión expirada");
                toast.success("Sesión cerrada por seguridad");
                logoutApi();
                setRefreshCheckLogin(true);
            }
        }
    }, []);
    // Termina cerrado de sesión automatico

    useEffect(() => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                const { admin } = data;
                //console.log(data)
                setEstadoUsuario(admin);
                if(admin === "true") {
                    //console.log("entra en true")
                }
                if(admin === "false") {
                    //console.log("entra en false")
                }
            }).catch((e) => {
                if(e.message == "Request failed with status code 400") {
                }
                if(e.message == 'Network Error') {
                    //console.log("No hay internet")
                    toast.error("Conexión al servidor no disponible");

                }
            })
        } catch (e) {

        }
    }, []);
    // Termina datos para el menu incluido aqui

    return (
        <>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={LogoFredherBlanco}
                                            width="125px"
                                            alt="Workflow"
                                            className="logoPrincipal"
                                            onClick={() => {
                                                rutaInicio()
                                            }}
                                        />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {/* Navegacion */}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <button
                                            type="button"
                                            className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="ml-3 relative">
                                            <div>
                                                <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-8 w-8 rounded-full" src={ImagenPerfil} alt=""/>
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
                                                        <button
                                                            onClick={() => {
                                                                cerrarSesion()
                                                            }}
                                                            className="cerrarSesion"
                                                        >
                                                            Cerrar sesion
                                                        </button>
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
                                            <XIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {/* navegacion */}
                            </div>
                            <div className="pt-4 pb-3 border-t border-gray-700">
                                <div className="flex items-center px-5">
                                    {/* Incluir desplegable */}
                                    <div className="flex-shrink-0">
                                        <img
                                            className="logoPrincipal"
                                            className="h-8 w-8 rounded-full"
                                            src={ImagenPerfil}
                                            alt=""
                                            onClick={() => {
                                                rutaInicio()
                                            }}
                                        />
                                    </div>
                                    <div className="ml-3">
                                        {/*<div className="text-base font-medium leading-none text-white">{user.name}</div>*/}
                                        {/*<div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>*/}
                                    </div>
                                    <button
                                        type="button"
                                        className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    >
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="mt-3 px-2 space-y-1">
                                    {/* Navegacion */}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <MenuEscala setRefreshCheckLogin={setRefreshCheckLogin}>
                <li className="homePrincipal">
                    <h2>
                        <Link to="/Productos" >Matriz de productos</Link>
                    </h2>
                </li>
                <li className="homePrincipal">
                    <h2>
                        <Link to="/Materiales" >Mis materiales</Link>
                    </h2>
                </li>
                <li className="homePrincipal">
                    <h2>
                        <Link to="/Requisiciones" >Mis requisiciones</Link>
                    </h2>
                </li>
            </MenuEscala>

        </>
    );
}

export default MenuDepartamentos;
