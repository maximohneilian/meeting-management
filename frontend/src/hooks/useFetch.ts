import { useState, useEffect } from "react";
import { api } from "../api";
import { useAppSelector } from "../store/hooks";
import axios, {AxiosError} from "axios";

export default function useFetch(endpoint: string) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<any| null>(null);


  const accessToken = useAppSelector(store => store.user.validAccessToken)

  useEffect(() => {

/*     console.log("AccesToken", accessToken) */
    const config = { headers: { Authorization: `Bearer ${accessToken? accessToken : ""}`}}
  /*   console.log("Fetching data") */
    const fetchData = async () => {
 
      // console.log("Endpoint", endpoint)
      // get content from API
      try {
        setLoading(true);
        console.log("Config:", config)
        const response = await api.get(endpoint, config)
        if(response.data) {
          console.log(response)
          setResultData(response.data)
          console.log(resultData)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return {resultData, loading, error };
}