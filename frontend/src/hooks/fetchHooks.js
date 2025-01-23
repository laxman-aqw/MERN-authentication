import axios from "axios";
import { useEffect, useState } from "react";
import { getUserEmailFromtoken } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: true,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchData = async () => {
      try {
        const { email } = !query ? await getUserEmailFromtoken() : {};
        setData((prev) => ({ ...prev, isLoading: true }));

        const { data, status } = !query
          ? await axios.get(`/api/user/${email}`)
          : await axios.get(`/api/${query}`);

        if (isMounted) {
          if (status >= 200 && status < 300) {
            setData({
              isLoading: false,
              apiData: data,
              status,
              serverError: null,
            });
          } else {
            setData({
              isLoading: false,
              apiData: undefined,
              status,
              serverError: `Error: ${status}`,
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          setData({
            isLoading: false,
            apiData: undefined,
            status: null,
            serverError: error,
          });
        }
      }
    };

    fetchData();

    return () => (isMounted = false); // Cleanup on unmount
  }, [query]); // Only refetch when query changes

  return [getData, setData];
}
