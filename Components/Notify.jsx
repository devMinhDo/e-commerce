import { useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Loading from './Loading';
import Toast from "./Toast";
const Notify = () => {
    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    return (
        <>
            {notify.loading && <Loading />}
            {notify.error && <Toast msg={{ msg: notify.error, title: "Error" }}
                handleShow={() => {
                    dispatch({ type: 'NOTIFY', payload: {} });

                }}
                bgColor="bg-danger"
            />
            }
            {notify.error && setTimeout(() => {
                dispatch({
                    type: 'NOTIFY',
                    payload: {}
                })
            }, 5000)}
            {notify.success && <Toast msg={{ msg: notify.success, title: "Success" }}
                handleShow={() => {
                    dispatch({ type: 'NOTIFY', payload: {} })
                }}
                bgColor="bg-success"
            />}
            {notify.success && setTimeout(() => {
                dispatch({
                    type: 'NOTIFY',
                    payload: {}
                })
            }, 5000)}
        </>
    )
}
export default Notify