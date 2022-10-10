import React, { useEffect, useState,useContext, useRef } from 'react';

function DragDropFile(props:any) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleDrag = (e:any)=> {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };
    
    const handleDrop = (e:any)=> {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        props.agregaArchivosAct(e.dataTransfer.files[0])
      }
    };
    
    const handleChange = (e:any)=> {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        props.agregaArchivosAct(e.dataTransfer.files[0])
      }
    };
    
    const onButtonClick = () => {
        inputRef.current?.click();
    };
    
    return props.archivo ?
    <div className='d-flex justify-content-between'>
    <p className='m-0'>{props.archivo.name}</p>
    <button className="btn btn-outline-primary btn-sm" onClick={(e)=>props.eliminaArchivoAct(null)}><i className="far fa-trash-alt"></i></button>
    </div>
    :
      <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
        <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
        <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
          <div>
            <p>{props.desc}</p>
            <button className="upload-button btn btn-outline-primary btn-sm" onClick={onButtonClick}>Agregar Documento</button>
          </div> 
        </label>
        { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
      </form>
    
  };

  export default DragDropFile