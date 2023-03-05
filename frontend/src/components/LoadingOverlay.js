import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const LoadingOverlay = ({ loading }) => {

    return (
        <Modal
            className="d-flex justify-content-center align-items-center"
            show={loading}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Body
                className="d-flex flex-column align-items-center">
                <Spinner style={{ width: "40px", height: "40px", margin: "5px" }} animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        </Modal>
    );

}

export { LoadingOverlay };