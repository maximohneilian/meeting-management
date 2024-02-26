import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    validAccessToken: null,
    userData: null,
    googleAccess: {
        token: null,
        expiry: null,
    },
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            console.log("logging in")
            state.validAccessToken = action.payload
        },
        loadUser: (state, action) => {
            state.userData = action.payload
            // console.log('load user slice', action.payload)
        },
        logout: (state) => {
            console.log("logging out")
            state.validAccessToken = null
            state.userData = null
            state.googleAccess = {token: null, expiry: null}
        },
        setGoogleAccessToken: (state, action) => {
            console.log("Save google token:", action.payload)
            state.googleAccess.token = action.payload
        }
    },
})

export const {login, loadUser, logout, setGoogleAccessToken} = userSlice.actions

export default userSlice.reducer