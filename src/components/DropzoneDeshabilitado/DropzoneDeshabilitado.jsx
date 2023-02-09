import { useState, useEffect, useCallback } from 'react';
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import fotoNoDisponible from "../../assets/png/adjuntar.png"

import "./DropzoneDeshabilitado.scss";

function DropzoneDeshabilitado(props) {
    const { setImagen, imagenBD } = props;

    const [slide, setSlide] = useState([]);

    //console.log(setImagen)
    //console.log(imagenBD)

    const onDropImagen = useCallback((acceptedFiles) => {
        //console.log(acceptedFiles);

        setSlide(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));

        const file = acceptedFiles[0];
        //setURLFinal(URL.createObjectURL(file));
        setImagen(file);
    });

    const {getRootProps, getInputProps} = useDropzone({
        accept: ".pdf, image/*",
        onDrop: onDropImagen,
        noClick: true,
    });

    useEffect(() => {
        slide.map((file, key) => {
            const tempType = file.type.split("/");
            const type = tempType[0];
            const temp = file.name.split(".");
            const Ext = temp[1];
            //console.log(Ext);
            //console.log(type);
        });
    }, [slide]);

    const visualizarSlide1 = slide.map(file => (
        <div key={file.name}>
            <div>
                <img
                    src={file.preview}
                />
            </div>
        </div>
    ));

    return (
        <div className="archivo"
             {...getRootProps()}
        >
            {imagenBD && slide.length === 0 ?
                (
                    <>
                        <aside>
                            <img
                                src={imagenBD}
                            />
                        </aside>
                    </>
                )
                :
                (
                    slide ?
                        (
                            <>
                                <aside>
                                    {visualizarSlide1}
                                </aside>
                            </>
                        )
                        :
                        (
                            <>
                                <aside>
                                    <img src={fotoNoDisponible} />
                                </aside>
                            </>
                        )
                )
            }

            <input {...getInputProps()} />
        </div>
    );
}

export default DropzoneDeshabilitado;
