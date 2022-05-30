import React, { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import { DeleteItem } from "../store/action";
import { DeleteData } from "../utils/fetchData";
import { useRouter } from "next/router";
const Modal = () => {
  const { state, dispatch } = useContext(DataContext);
  const { modal, auth } = state;
  const router = useRouter();
  const deleteUser = async (item) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    await DeleteData(`user/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(DeleteItem(item.data, item.id, item.type));
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };
  const deleteCategory = async (item) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    await DeleteData(`categories/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(DeleteItem(item.data, item.id, item.type));

      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };
  const deleteProduct = (item) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    DeleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return router.push("/");
    });
  };
  const handleDelete = async () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_CART") {
          dispatch(DeleteItem(item.data, item.id, item.type));
        }
        if (item.type === "ADD_USERS") await deleteUser(item);
        if (item.type === "ADD_CATEGORIES") await deleteCategory(item);
        if (item.type === "DELETE_PRODUCT") deleteProduct(item);
      }
    }

    dispatch({ type: "ADD_MODAL", payload: [] });
  };
  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-capitalize" id="exampleModalLabel">
              {modal.length !== 0
                ? modal[0].title.toUpperCase()
                : "XÁC NHẬN XÓA"}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="text-info">
              {`Xác nhận xóa : ${
                modal.length !== 0 ? modal[0].title : "Tất cả"
              } `.toUpperCase()}
            </p>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-dismiss="modal"
              onClick={() => {
                handleDelete();
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
