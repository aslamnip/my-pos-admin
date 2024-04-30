import React, { useEffect, useState, useContext } from 'react';
import { fetchUrl } from '../../config';
import SideNav from '../SideNav/SideNav';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';


function Sliders() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [firstSliders, setFirstSliders] = useState([])
    const [addNew, setAddNew] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [editeID, setEditID] = useState('')
    const accessToken = localStorage.getItem('access_token')

    useEffect(() => {
        fetch(`${fetchUrl}/api/slider/first/`)
            .then(res => res.json())
            .then(data => setFirstSliders(data))
    }, [isLoading])

    const deleteSlide = (id) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/slider/first/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "DELETE",
        })
            .then(res => {
                setEdit(false)
                setAddNew(false)
                setIsLoading(false)
                if (res.status === 204) {
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }
    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div className='mt-5 ms-3'>
                        <button className='btn btn-warning mb-3' onClick={() => setAddNew(!addNew)} type='button'>Add New Slider</button>
                        {
                            addNew ? <SliderForm setIsLoading={setIsLoading} method='POST' submitUrl={`${fetchUrl}/api/slider/first/create/`} />
                                : null
                        }
                    </div>
                    {firstSliders.map(data =>
                        <div className='mt-5' key={data.id}>
                            <img src={data.image} alt="slider" width="70%" />
                            <p className='mt-3'>Slider URL -  <a href={`${data.url}`}>{data.url}</a></p>
                            <div className='d-flex' >Slider Backgorund Color - {data.color} <p style={{ margin: "3px 0 0 8px", width: "20px", height: "20px", background: ` ${data.color}` }} /></div>
                            <button onClick={() => { setEditID(data.id); setEdit(!edit) }} type="button" className="btn btn-outline-primary mb-3">Edit</button>
                            <button className='btn btn-danger mb-3 ms-3' type='button' onClick={() => deleteSlide(data.id)}> Delete</button>
                            {
                                edit && editeID === data.id ?
                                    <SliderForm setEdit={setEdit} setIsLoading={setIsLoading} method="PUT" submitUrl={`${fetchUrl}/api/slider/first/${editeID}/`} />
                                    : null
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Sliders;

function SliderForm(props) {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const { method, submitUrl, setIsLoading, setEdit } = props
    const [inputValue, setInputValue] = useState({
        image: '',
        url: '/',
        color: ''
    })

    const handleInput = (e) => {
        if (e.target.name === 'image') {
            const newInput = { ...inputValue }
            const x = e.target.files[0]
            newInput.image = x
            setInputValue(newInput)
        }
        if (e.target.name === 'url') {
            const newInput = { ...inputValue }
            newInput.url = e.target.value
            setInputValue(newInput)
        }
        if (e.target.name === 'color') {
            const newInput = { ...inputValue }
            newInput.color = e.target.value
            setInputValue(newInput)
        }
    }
    const handleSubmitSlider = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const fromData = new FormData()
        fromData.append('image', inputValue.image)
        fromData.append('url', inputValue.url)
        fromData.append('color', inputValue.color)
        fetch(submitUrl, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method,
            body: fromData
        })
            .then(res => {
                setIsLoading(false)
                setEdit(false)
                if (res.status === 201 || res.status === 200) {
                    setShowAlert(true)
                    setAlertText(` Success`)
                    setAlertVariant('success')
                    setInputValue({})
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }
    return (
        <div className='col-md-6'>
            <form onSubmit={handleSubmitSlider}>
                <input required={method === 'POST'} className='form-control mb-3' type="file" name="image" id="image" onChange={handleInput} />
                <input className='form-control mb-3' placeholder='Url' type="text" name="url" id="url" onChange={handleInput} />

                <div className='input-group'>
                    <div className="input-group-prepend">
                        <span style={{background  : `${inputValue.color}`, height : '70%',}} className="input-group-text text-danger" id="basic-addon1" />
                    </div>
                    <input className='form-control mb-3' placeholder='Background color' type="text" name="color" id="color" onChange={handleInput} />
                </div>

                {/* <input className='form-control mb-3' placeholder='Background color' type="text" name="color" id="color" onChange={handleInput} /> */}
                <input className='btn btn-success' type="submit" value="Submit" />
            </form>
        </div>
    )
}