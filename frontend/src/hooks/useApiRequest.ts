import { useState } from "react";
import { api } from "../api";
import { useAppSelector } from "../store/hooks";
import axios from "axios";

export default function useApiRequest() {
  const [error, setError] = useState<String>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [resultData, setResultData] = useState<any>(null)

  const accessToken = useAppSelector(state => state.user.validAccessToken)
  type RequestData = object | null;

  
  const sendRequest = async (method : string, endpoint : string, data : RequestData) => {
    
    console.log("Data", data)
    const config = { headers: { Authorization: `Bearer ${accessToken? accessToken : ""}`, "Content-Type": "multipart/form-data"}}
    console.log("Config", config)

    setLoading(true)

    try {
      let response
      if (method === "get"){
        response = await api[method](endpoint, config)
      }
      else if (method === "patch") {
        response = await api[method](endpoint, data, config)
      }
      else if (method === "post") {
        response = await api[method](endpoint, data, config)
      }
      else if (method === "delete") {
        response = await api[method](endpoint, config)
      }
      else {
        response = await api.get(endpoint, config)
      }

      setError("")
      if (response.data) {
        console.log("Response data", response.data)
        setResultData(response.data)
      }
      else
        return setResultData('success')
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.status)
        console.error(error.response);
        if (error.response?.data) { 
          console.log("Error", error.response.data)
          if (error.response.data.detail) {
            return setError(error.response.data.detail);
          }
          else {
            return setError(Object.entries(error.response.data).join(": "))
          }
        } else {
          return setError("Operation failed");
        }
      } else {
        console.error(error);
      }
    }
    finally {
      setLoading(false)
    }
  }

  return { sendRequest, resultData, loading, error}  
}