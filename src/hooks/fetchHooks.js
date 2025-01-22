import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: true,
    apiData: undefined,
    status: null,
    serverError: null,
  });
  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        const { data, status } = await axios.get(`/api/${query}`);
        // console.log("API response:", data, status);
        if (status >= 200 && status < 300) {
          setData((prev) => ({
            ...prev,
            isLoading: false,
            apiData: data,
            status,
          }));
        } else {
          // Handle non-2xx status codes (e.g., 4xx, 5xx)
          setData((prev) => ({
            ...prev,
            isLoading: false,
            serverError: `Error: ${status}`,
          }));
        }
      } catch (error) {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error,
        }));
      }
    };
    fetchData();
  }, [query]);
  return [getData, setData];
}
