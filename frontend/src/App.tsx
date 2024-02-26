// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';

import { MantineProvider, LoadingOverlay} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Router from './routes';
import "./App.css"
import {theme} from "./theme.ts"
import { useAppSelector } from './store/hooks';
import { useDispatch } from 'react-redux';
import useApiRequest from './hooks/useApiRequest';
import { useEffect } from 'react';
import { login, logout } from './store/slices/user';

export default function App() {
  const validAccessToken = useAppSelector(state => state.user.validAccessToken)
  const dispatch = useDispatch()
  const localToken = localStorage.getItem("accessToken"); // read the accessToken from localStorage

  const {sendRequest, error} = useApiRequest()

  useEffect(() => {
    
    console.log("Reading token from local storage:", localToken)

    // if localToken exists, get it verified by the backend to check whether it's not expired or invalid for other reasons
    // if successfully validated, store it in Redux as well
    // if not validated, remove localToken and remove it from Redux as well
    if (localToken) {
      sendRequest("post", "/auth/token/verify/", {token: localToken})
      .then(() => {
        // console.log("foo")
        dispatch(login(localToken))
      
        if (error) {
          console.log("Token not valid -> Remove token")
          localStorage.removeItem("accessToken")
          dispatch(logout())
        }
      })      
    }
    else {
      dispatch(logout());
    }
  }, [])

  
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" >
      <ModalsProvider>
        <>
          {localToken && !validAccessToken ? 
          <LoadingOverlay
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 1 }}
            loaderProps={{ color: "#A1C8AD", type: 'bars' }}
          /> :
          <Router/>
          }
        </>
      </ModalsProvider>
    </MantineProvider>
  )
}