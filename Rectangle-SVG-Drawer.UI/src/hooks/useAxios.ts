import axios from "axios";
import { useState } from "react";
import { Constants } from "../utilities/constants";

const useAxios = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successfullyCompleted, setSuccessfullyCompleted] = useState(false);

    const instance = axios.create({
        baseURL: Constants.BaseUrl
    });

    const fetchData = async(url: string, data = {}, params = {}) => {
        initialize();
        
        try {
            const result = await instance({
                url,
                method: 'GET',
                data,
                params
            });

            setResponse(result.data);
            setSuccessfullyCompleted(true);
        } catch (error: any) {
            setError(error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const saveData = async(url: string, method: 'POST' | 'PUT', data = {}, params = {}) => {
        initialize();
        
        try {
            const result = await instance({
                url,
                method,
                data,
                params
            });

            setResponse(result.data);
            setSuccessfullyCompleted(true);
        } catch (error: any) {
            setError(error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const initialize = () => {
        setSuccessfullyCompleted(false);
        setLoading(true);
        setResponse(null);
        setError('');
    }

    return { response, error, loading, successfullyCompleted, fetchData, saveData };
}

export default useAxios;