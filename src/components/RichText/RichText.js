import React, {  } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './RichText.css'

function RichText(props) {
    const {value, setValue, editorRef} = props
    
    const modules = {
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, 
           {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          ['clean']
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        }
      }
      /* 
       * Quill editor formats
       * See https://quilljs.com/docs/formats/
       */
    const  formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
      ]
      


    return (
        <div>
            <ReactQuill modules={modules} formats={formats}  ref={editorRef}   theme="snow" value={value} onChange={setValue}   />
        </div>
    );
}

export default RichText;