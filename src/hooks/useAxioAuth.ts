"user client";

import { axiosAuth } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxioAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use((config) => {
      if (!config.headers["Authorization"]) {
        config.headers["Authorization"] = `Bearer ${session?.user?.jwt}`;
      }
      return config;
    });

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
    };
  }, [session]);

  return axiosAuth;
};

export default useAxioAuth;
