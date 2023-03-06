

const FavouritesListItem = ({data}) => {

    let today = new Date()
    let date = new Date(data.time)
    let online_today = (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear())

    return (
        <div className="d-flex align-items-center justify-content-between w-100 p-2 px-4 px-lg-3 border-bottom hover-chat-item">
            <div className="d-flex align-items-center">
                <img src="default-image.png" height={'50px'} />
                <div className="d-flex flex-column align-items-start ms-4">
                    <h6>{data.name}</h6>
                    <small>{data.message}</small>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <small>last online</small>
                <small>{online_today ? date.toTimeString().substring(0,5): date.toDateString()}</small>
            </div>
        </div>
    )

}

export { FavouritesListItem };