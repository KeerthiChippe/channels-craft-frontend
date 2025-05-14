import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startGetDeletedPackage, startUndoPackage } from "../../actions/package-action";
import 'bootstrap/dist/css/bootstrap.min.css';

const DeletedPackage = () => {
    const dispatch = useDispatch();
    
    const packages = useSelector((state) => {
        return state.package.deletedPackages.filter((ele) => ele.isDeleted === true);
    });

    useEffect(() => {
        dispatch(startGetDeletedPackage());
    }, [dispatch]);

    const handleUndo = (id) => {
        dispatch(startUndoPackage(id));
        alert('Package successfully restored');
    };

    return (
        <div className="container mt-5 ">
            <h2>Undo Deleted Packages</h2>
            <ul className="list-group mt-3">
                {packages.map((ele) => (
                    <li key={ele.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{ele.packageName}</span>
                        <button className="btn btn-primary" onClick={() => handleUndo(ele._id)}>Undo</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeletedPackage;
