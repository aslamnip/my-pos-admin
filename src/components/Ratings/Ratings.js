/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';



function Ratings() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(false)
    const [approved, setApproved] = useState(false)
    const [editAble, setEditAble] = useState(false)
    const [ratingId, setRatingId] = useState('')
    const [ratings, setRating] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/rating/`)
            .then(res => res.json())
            .then(data => setRating(data))
    }, [])
    const handleUpdataInput = (e) => {
        setApproved(e.target.checked)
    }
    const handleRatingId = (id) => {
        setRatingId(id);
        setEditAble(true)
        const findRating = ratings.find(data => data.id === id)
        setApproved(findRating.approved)
    }
    const updateRating = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append("approved", approved)

        fetch(`${fetchUrl}/api/rating/${ratingId}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 200) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
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
                    <div>
                        <ul style={{ listStyle: "none" }} className='row p-5'>
                            {
                                ratings && ratings.map(data =>
                                    <li className='my-5 col-md-6 border p-2 ' key={data.id}>
                                        <div className=''>
                                            <h4>Product : {data.productx}</h4>
                                            <h5>Rating Point : <span className='text-danger'>{data.rating_point}</span> </h5>
                                            <h6>Rating Text : <span className='text-success'>{data.rating_text}</span></h6>
                                            {
                                                data.rating_image ?
                                                    <div>
                                                        <p>Rating Image :</p>
                                                        <img src={data.rating_image} width={100} height={100} alt="customerImage" />
                                                    </div>
                                                    : null}
                                            <form onSubmit={updateRating}>
                                                <div className='form-check'>
                                                    <input className='form-check-input' onChange={handleUpdataInput} type="checkbox" name="approve" id={`approve_${data.id}`} checked={data.id === ratingId ? approved : data.approved} disabled={data.id !== ratingId} />
                                                    <label className='form-check-label' htmlFor={`approve_${data.id}`}>Approved</label>
                                                </div>
                                                <div className='mt-3'>
                                                    {
                                                        editAble && data.id === ratingId ?
                                                            <input type='submit' className='btn btn-success' value="Update This Rating " />
                                                            :
                                                            <button className='btn btn-dark my-1' type='button' onClick={() => handleRatingId(data.id)}>Cllick here to Update </button>
                                                    }
                                                </div>
                                            </form>
                                        </div>
                                    </li>

                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ratings;