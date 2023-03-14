import { useState, useEffect, useCallback } from 'react';
import { Form, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import fotoNoDisponible from "../../assets/png/adjuntar.png"

import "./DropzoneFormularios.scss";

function DropzoneFormularios(props) {
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
                <Image
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
                            <Image
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
                                    <Image src={fotoNoDisponible} />
                                </aside>
                            </>
                        )
                )
            }

            <Form.Control {...getInputProps()} />
        </div>
    );
}

export default DropzoneFormularios;
