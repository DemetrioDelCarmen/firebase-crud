import React, { useEffect, useState } from 'react'
import LinkForm from './LinkForm'
import { db } from '../firebase'
import Swal from 'sweetalert2'

const Links = () => {


    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
    });

    const [links, setLinks] = useState([])
    const [currentId,setCurrentId] = useState('')


    const addOrEditLink = async (linkObject) => {
      try {
        if(currentId ===''){
            await db.collection('links').doc().set(linkObject)
            Toast.fire({
                type: 'info',
                background: "#CDFFEC",
                title: "Link created successfully"
            });
          }else{
              await db.collection('links').doc(currentId).update(linkObject);
              Toast.fire({
                type: 'info',
                background: "#CDFFEC",
                title: "Link updated successfully"
            });
            setCurrentId('');
    
          }
      } catch (error) {
          console.log(error)
      }
    }


    const getLinks = async () => {
        db.collection('links')
        .orderBy('name','desc')
        .onSnapshot((querySnapshot) => {

            const docs = [];
            querySnapshot.forEach(doc => {
                docs.push({ ...doc.data(), id: doc.id })
            });
            setLinks(docs)
        });

    }

    const onDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this link')) {
            await db.collection('links').doc(id).delete();

            

            Toast.fire({
                type: 'success',
                background: "#CDFFEC",
                title: "Link deleted successfully"
            })
        }
    }

    useEffect(() => {

        getLinks()

    }, []);


    return (

        <div>

            <div className="col-md-4 p-2">
                <LinkForm {...{addOrEditLink,currentId,links}} />
            </div>
            <div className="col-m-8 p-2">
                {links.map((link) => (
                    <div className="card mb-1" key={link.id}>
                        <div className="card-body">
                            <div className='d-flex justify-content-between'>
                                <h4>{link.name}</h4>
                                <div>
                                    <i onClick={() => onDelete(link.id)} className='material-icons text-danger'>close</i>
                                    <i className='material-icons' onClick={()=>setCurrentId(link.id)} >edit</i>
                                </div>
                            </div>
                            <p>{link.description}</p>
                            <a href={link.url} target="_blank" rel="noopener noreferrer">Go to website</a>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}

export default Links;