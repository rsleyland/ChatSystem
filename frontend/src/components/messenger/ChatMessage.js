

const ChatMessage = ({ message, image, time = "9:50 AM", sender, include_sender = true, inbound=true }) => {

    let datetime = new Date(time)

    return (
        <>
            {include_sender &&
                <div className={inbound ? "d-flex align-items-center" : "d-flex align-items-center justify-content-end"}>
                    <img src={image || "default-image.png"} height={'40px'} className={"rounded-circle"} />
                    <div className="d-flex flex-column align-items-start ms-4">
                        <p className="m-0 text-white" style={{ fontWeight: "500" }}>{sender || "Unknown"}</p>
                        <small className="fst-italic text-muted">{datetime.toTimeString().substring(0,5)} - {datetime.toDateString().substring(0,16)}</small>
                    </div>
                </div>}

            <div className={inbound ? "d-flex align-items-center" : "d-flex align-items-center justify-content-end"}>
                <p className={inbound ? "rounded p-2 px-3 m-0 mt-2 ms-4 text-white": "rounded p-2 px-3 m-0 mt-2 me-4 bg-primary text-white"} style={{ backgroundColor: "rgba(0, 0, 0, 0.15" }}>{message}</p>
            </div>
        </>
    )
}

export { ChatMessage };