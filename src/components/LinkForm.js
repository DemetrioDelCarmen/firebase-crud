import React, { useState, useEffect } from 'react'
import { db } from '../firebase';
import Swal from 'sweetalert2';
const LinkForm = (props) => {



    const intialStateValues = {
        url: '',
        name: '',
        description: ''
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
    });

    const [values, setValues] = useState(intialStateValues);

    const handleInputChange = e => {
        const { name, value } = e.target;
        console.log(name, value);
        setValues({ ...values, [name]: value });
    }



    const validateURL = str => {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(str);
    }

    const handlerSubmit = e => {
        e.preventDefault();
        if (!validateURL(values.url)) {

            Toast.fire({
                type: 'warning',
                background: "#CDFFEC",
                title: "Link not valid"
            })
        } else {
            props.addOrEditLink(values);
            setValues({ ...intialStateValues })
        }


    }


    const getLinkById = async (id) => {
        const doc = await db.collection('links').doc(id).get();
        setValues({ ...doc.data() })
    }

    useEffect(() => {
        if (props.currentId === '') {
            setValues({ ...intialStateValues });
        } else {
            getLinkById(props.currentId);
        }
    }, [props.currentId])

    return (
        <form className='card card-body' onSubmit={handlerSubmit}>
            <div className='form-group input-group'>
                <div className='input-group-text bg-light'>
                    <i className="material-icons">insert_link</i>
                </div>
                <input onChange={handleInputChange} value={values.url} name='url' type="text" className='form-control' />
            </div>


            <div className="form-group input-group">
                <div className="input-group-text bg-light">
                    <i className='material-icons'>create</i>
                </div>
                <input onChange={handleInputChange} value={values.name} type="text" className='form-control' name="name" id="" />
            </div>

            <div className="form-group">
                <textarea onChange={handleInputChange} value={values.description} name="description"
                    cols="30" placeholder='Write a description' rows="3"
                    className='form-control'></textarea>
            </div>
            <button className='btn btn-primary btn-block'>
                {props.currentId === '' ? 'Save' : 'Update'}
            </button>
        </form>
    )
}

export default LinkForm;