"use client";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useState } from "react";
import { useUserStore } from "@/context/index";
import LoadingScreen from "@/components/global/FullScreenLoader";
import ErrorScreen from "@/components/global/ErrorScreen";
import { useAuth } from "@clerk/nextjs";
function AuthWrapper({ children }: React.PropsWithChildren) {
  const {isLoaded,isSignedIn} = useAuth();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { clearUser,setUser } = useUserStore();
  const fetchData = useCallback(async () => {
    try {
      setLoaded(false);
      setError("");
      if (isLoaded && isSignedIn) {
        const response = await fetch("/api/user/me");
        const data = await response.json();
        if (!data.success) throw Error(data.message);
        // console.log(data);
        setUser(data.data);
      }
    } catch (error: any) {
      clearUser();
      setError(error.message);
    } finally {
      setTimeout(() => {
        setLoaded(true);
      }, 2500);
    }
  },[isSignedIn,isLoaded]);
  useEffect(() => {
    fetchData();
  }, [isLoaded,isSignedIn]);
  if (!loaded || !isLoaded) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen reset={fetchData} title={"Something Went Wrong!"} description={error} />;
  }
  return children;
}
export default AuthWrapper;