E-commerce-MERN-frontend folder > create folders > nodejs-ecommerce-api, react-playground

0. react-playground terminal > npx create-react-app .

    react-playground terminal > yarn start

    install tailwind https://tailwindcss.com/docs/guides/create-react-app

    react-playground terminal > npm install
    react-playground terminal > npm install --save sweetalert2 sweetalert2-react-content
    react-playground terminal > npm audit fix --force
    react-playground terminal > npm install -D tailwindcss
    react-playground terminal > npx tailwindcss init
    
    tailwind.config.js

        /** @type {import('tailwindcss').Config} */
        module.exports = {
        content: [
            "./src/**/*.{js,jsx,ts,tsx}",
        ],
        theme: {
            extend: {},
        },
        plugins: [],
        }
    
    react-playgrond > src > index.css

        @tailwind base;
        @tailwind components;
        @tailwind utilities;

    react-playgrond > src > playgrond > SweetAlert.js

        import Swal from 'sweetalert2';

        const SweetAlert = ({icon, title, message}) => {
            Swal.fire({
                icon,
                title,
                text: message,
            });
        };

        export default SweetAlert;

    react-playground > src > app.js

        import './App.css';
        import SweetAlert from './Playground/SweetAlert';

        function App() {
            return (
                <div className="App">
                    <SweetAlert icon='success' title='Login' message='success' />
                    <h1 className='text-red-500'>hello world</h1>
                </div>
            );
        }

        export default App;

1. setup project mern-stack-ecommerce-frontend-starter from github

    E-commerce-MERN-frontend terminal > git clone https://github.com/tweneboah/mern-stack-ecommerce-frontend-starter.git
    E-commerce-MERN-frontend terminal > cd mern-stack-ecommerce-frontend-starter
    mern-stack-ecommerce-frontend-starter terminal > npm i
    mern-stack-ecommerce-frontend-starter terminal > .gitignore
    mern-stack-ecommerce-frontend-starter terminal > yarn add @reduxjs/toolkit
    mern-stack-ecommerce-frontend-starter terminal > npm install --save sweetalert2 sweetalert2-react-content

    E-commerce-MERN-frontend terminal > .gitignore

        node_modules

    mern-stack-ecommerce-frontend-starter terminal > yarn start

2. install redux toolkids https://redux-toolkit.js.org/introduction/getting-started

    mern-stack-ecommerce-frontend-starter terminal > npm install @reduxjs/toolkit
    mern-stack-ecommerce-frontend-starter terminal > npm i react-redux axios

3. create folders and files
    mern-stack-ecommerce-frontend-starter > src > redux > store > store.js
    mern-stack-ecommerce-frontend-starter > src > redux > slices > users > usersSlice.js

4. Users Initial State and Login action and User slice เมื่อมีการเข้าถึงฐานข้อมูล ใช้ createAsyncThunk

    mern-stack-ecommerce-frontend-starter > src > utils

        const baseURL = "http://localhost:2023/api/v1";

        export default baseURL;


    mern-stack-ecommerce-frontend-starter > src > redux > slices > users > usersSlice.js

        import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
        import axios from 'axios';
        import baseURL from '../../utils/baseURL';
        import { resetErrAction, resetSuccessAction } from './globalActions/globalActions';

        //initialState
        const initialState = {
            loading: false,
            error: null,
            users: [],
            user: {},
            profile: {},
            userAuth: {
                loading: false,
                error: null,
                userInfo: {},
            },
        };

        //register action
        //{email, password} is payload
        export const registerUserAction = createAsyncThunk('users/register', async ({email, password, fullname}, {rejectWithValue, getState, dispatch}) => {
            try{
                console.log(baseURL)
                //make the http request
                const {data} = await axios.post(`${baseURL}/users/register`,{
                    email,
                    password,
                    fullname,
                });
                
                //sent data to payload
                return data;
            }catch(error){
                console.log(error);
                return rejectWithValue(error?.response?.data);
            }
        });

        //register action
        //{email, password} is payload
        export const loginUserAction = createAsyncThunk('users/login', async ({email, password}, {rejectWithValue, getState, dispatch}) => {
            try{
                console.log(baseURL)
                //make the http request
                const {data} = await axios.post(`${baseURL}/users/login`,{
                    email,
                    password,
                });
                //save the user into localstorage
                localStorage.setItem('userInfo', JSON.stringify(data));
                //sent data to payload
                return data;
            }catch(error){
                console.log(error);
                return rejectWithValue(error?.response?.data);
            }
        });

        //user slice
        const usersSlice = createSlice({
            name: 'users',
            initialState,
            extraReducers: (builder)=>{
                //handle actions
                //login
                builder.addCase(loginUserAction.pending, (state, action) => {
                    state.userAuth.loading = true;  
                });
                builder.addCase(loginUserAction.fulfilled, (state, action) => {
                    state.userAuth.userInfo = action.payload;
                    state.userAuth.loading = false;
                });
                // when res.status error
                builder.addCase(loginUserAction.rejected, (state, action) => {
                    state.userAuth.error = action.payload;
                    state.userAuth.loading = false;
                });
                //register
                builder.addCase(registerUserAction.pending, (state, action) => {
                    state.loading = true;  
                });
                builder.addCase(registerUserAction.fulfilled, (state, action) => {
                    state.user = action.payload;
                    state.loading = false;
                });
                // when res.status error
                builder.addCase(registerUserAction.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
                });
                // reset error action
                builder.addCase(resetErrAction.pending, (state)=>{
                    state.error = null;
                });
            },
        });

        //generate reducer
        const usersReducer = usersSlice.reducer;
        export default usersReducer;

5. Connect to redux store

    src > redux > store > store.js

        import {configureStore} from '@reduxjs/toolkit';
        import usersReducer from '../slices/users/usersSlice';

        //store
        const store = configureStore({
            reducer: {
                users: usersReducer,
            },
        });

        export default store;

    src > index.js

        import store from "./redux/store/store";
        import { Provider } from "react-redux";

        const root = ReactDOM.createRoot(document.getElementById("root"));
        root.render(
            <Provider store={store}>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </Provider>
        );

    src > redux > slices > usersSlice.js

        import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
        import axios from 'axios';
        import baseURL from '../../utils/baseURL';
        import { resetErrAction, resetSuccessAction } from './globalActions/globalActions';

        //initialState
        const initialState = {
            loading: false,
            error: null,
            users: [],
            user: {},
            profile: {},
            userAuth: {
                loading: false,
                error: null,
                userInfo: {},
            },
        };

        //register action
        //{email, password, fullname} is payload
        export const registerUserAction = createAsyncThunk('users/register', async ({email, password, fullname}, {rejectWithValue, getState, dispatch}) => {
            try{
                console.log(baseURL)
                //make the http request
                const {data} = await axios.post(`${baseURL}/users/register`,{
                    email,
                    password,
                    fullname,
                });
                
                //sent data to payload
                return data;
            }catch(error){
                console.log(error);
                return rejectWithValue(error?.response?.data);
            }
        });

        //login action
        //{email, password} is payload
        export const loginUserAction = createAsyncThunk('users/login', async ({email, password}, {rejectWithValue, getState, dispatch}) => {
            try{
                console.log(baseURL)
                //make the http request
                const {data} = await axios.post(`${baseURL}/users/login`,{
                    email,
                    password,
                });
                //save the user into localstorage
                localStorage.setItem('userInfo', JSON.stringify(data));
                //sent data to payload
                return data;
            }catch(error){
                console.log(error);
                return rejectWithValue(error?.response?.data);
            }
        });

        //user slice
        const usersSlice = createSlice({
            name: 'users',
            initialState,
            extraReducers: (builder)=>{
                //handle actions
                //login
                builder.addCase(loginUserAction.pending, (state, action) => {
                    state.userAuth.loading = true;  
                });
                builder.addCase(loginUserAction.fulfilled, (state, action) => {
                    state.userAuth.userInfo = action.payload;
                    state.userAuth.loading = false;
                });
                // when res.status error
                builder.addCase(loginUserAction.rejected, (state, action) => {
                    state.userAuth.error = action.payload;
                    state.userAuth.loading = false;
                });
                //register
                builder.addCase(registerUserAction.pending, (state, action) => {
                    state.loading = true;  
                });
                builder.addCase(registerUserAction.fulfilled, (state, action) => {
                    state.user = action.payload;
                    state.loading = false;
                });
                // when res.status error
                builder.addCase(registerUserAction.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
                });
                // reset error action
                builder.addCase(resetErrAction.pending, (state)=>{
                    state.error = null;
                });
            },
        });

        //generate reducer
        const usersReducer = usersSlice.reducer;
        export default usersReducer;
    
6. cors Error Fixed <backend>

    backend terminal > npm i cors

        import cors from 'cors'

        //cors
        app.use(cors());

7. install extension

    peacock
    
    view > command palette > peacock change to a favorie color

8. Dispatch action to login, redirect after login

    src > components > Users > Forms > Login.js

9. sweetalert2 การแจ้งเตือนเมื่อมีข้อความ error เวลากรอกข้อความผิดพลาด
    *เมื่อกรอกข้อความผิดพลาดจะเกิดการแจ้งเตือนโดยค่า error ใน initialState จะถูกเปลี่ยนค่าเป็น error ที่ถูกส่งมาจาก payload
    *แต่เมื่อกรอกฟอร์มจะเกิดการ re-components แต่ค่า error ใน initialState ยังไม่ถูกเปลี่ยนจึงเกิดหน้าต่างแสดง error อย่างต่อเนื่อง
    *จึงต้องทำการ resetErrAction ที่สถานะ pending ให้ค่า error = null ที่ไฟล์ userSlice.js
    // reset error action
        builder.addCase(resetErrAction.pending, (state)=>{
        state.error = null;
    });


    mern-stack-ecommerce-frontend-starter terminal > npm install --save sweetalert2 sweetalert2-react-content

    src > redux > slices > globalActions > globalActions.js

        const {createAsyncThunk} = require('@reduxjs/toolkit');

        //reset error action
        export const resetErrAction = createAsyncThunk('resetErr-Action', ()=>{
            //sent {} to payload
            return {};
        });

        //reset success action
        export const resetSuccessAction = createAsyncThunk('resetErr-Action', ()=>{
            //sent {} to payload
            return {};
        });
    
    src > components > ErrorMsg > ErrorMsg.js

        import Swal from "sweetalert2";
        import { useDispatch } from "react-redux";
        import { resetErrAction } from "../../redux/slices/globalActions/globalActions";

        const ErrorMsg = ({ message }) => {
        const dispatch = useDispatch();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: message,
            });
            dispatch(resetErrAction());
        };

        export default ErrorMsg;

10. src > components > AuthRoute > AuthRoute.js, AdminRoute.js ป้องกันการเข้าถึงหน้า admin, หน้าที่ต้องเข้าสู่ระบบ

    src > AdminRoute.js

        import React from 'react'
        import Login from '../Users/Forms/Login';

        const AdminRoute = ({children}) => {
            //get user from localstorage
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const isAdmin = user?.userFound?.isAdmin ? true : false
            if(!isAdmin){
                return <h1>Access Deied, Admin only</h1>
            }
            return (
                <>{children}</>
            )
        }

        export default AdminRoute;

    src > AuthRoute.js
        
        import React from 'react'
        import Login from '../Users/Forms/Login';

        const AuthRoute = ({children}) => {
            //get user from localstorage
            const user = JSON.parse(localStorage.getItem('userInfo'));
            const isLoggedIn = user?.token ? true : false
            if(!isLoggedIn){
                return <Login/>
            }
            return (
                <>{children}</>
            )
        }

        export default AuthRoute;

    src > App.js

        import AuthRoute from "./components/AuthRoute/AuthRoutue";
        import AdminRoute from "./components/AuthRoute/AdminRoute";

            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>

11. Register components

    มีการตรวจ error โดยค่า error มาจากไฟล์ usersSlice.js        
    //get data from store
        const {error, loading, userInfo} = useSelector(
            (state) => state?.users?.userAuth
    );
    {error && <ErrorMsg message={error?.message}/>}

    มีการตรวจ loading โดยค่า loading มาจากไฟล์ usersSlice.js
    {loading ? (<LoadingComponent/>)
    :                 
        <button
            // disable the button if loading is true
            disabled={loading}
            className="mt-12 md:mt-16 bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
            Register
        </button>
    }

    import React, { useState } from "react";
    import {useDispatch, useSelector} from 'react-redux'
    import ErrorMsg from "../../ErrorMsg/ErrorMsg";
    import { registerUserAction } from "../../../redux/slices/users/usersSlice";
    import LoadingComponent from "../../LoadingComp/LoadingComponent";

    const RegisterForm = () => {
    //dispatch
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
    });
    //---Destructuring---
    const { fullname, email, password } = formData;
    //---onchange handler----
    const onChangeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //---onsubmit handler----
    const onSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(registerUserAction({fullname, email, password}));
    };
    //select store data
    const {user, error, loading} = useSelector((state) => state?.users);

    return (
        <>
        <section className="relative overflow-x-hidden">
            <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-2/6 px-4 mb-12 lg:mb-0">
                <div className="py-20 text-center">
                    <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                    Signing up with social is super quick
                    </h3>
                    {/* errr */}
                    {error && <ErrorMsg message={error?.message}/>}
                    <p className="mb-10">Please, do not hesitate</p>
                    <form onSubmit={onSubmitHandler}>
                    <input
                        name="fullname"
                        value={fullname}
                        onChange={onChangeHandler}
                        className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="text"
                        placeholder="Full Name"
                    />
                    <input
                        name="email"
                        value={email}
                        onChange={onChangeHandler}
                        className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="email"
                        placeholder="Enter your email"
                    />
                    <input
                        name="password"
                        value={password}
                        onChange={onChangeHandler}
                        className="w-full mb-4 px-12 py-6 border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                        type="password"
                        placeholder="Enter your password"
                    />
                        {loading ? (<LoadingComponent/>)
                        :                 
                        <button
                        // disable the button if loading is true
                        disabled={loading}
                        className="mt-12 md:mt-16 bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                        Register
                        </button>}
                    </form>
                </div>
                </div>
            </div>
            </div>
            <div
            className="hidden lg:block lg:absolute top-0 bottom-0 right-0 lg:w-3/6 bg-center bg-cover bg-no-repeat"
            style={{
                backgroundImage:
                'url("https://cdn.pixabay.com/photo/2017/03/29/04/47/high-heels-2184095_1280.jpg")',
            }}
            />
        </section>
        </>
    );
    };

    export default RegisterForm;


12. Login components

    src > components > Users > Form > Login.js
    เมื่อทำการกรอกฟอร์มมีการเก็บค่าต่างๆ และเมื่อกด submit ทำการส่ง action ไปที่
    //login action
    //{email, password} is payload
    export const loginUserAction = createAsyncThunk('users/login', async ({email, password}, {rejectWithValue, getState, dispatch}) => {
        try{
            console.log(baseURL)
            //make the http request
            const {data} = await axios.post(`${baseURL}/users/login`,{
                email,
                password,
            });
            //save the user into localstorage
            localStorage.setItem('userInfo', JSON.stringify(data));
            //sent data to payload
            return data;
        }catch(error){
            console.log(error);
            return rejectWithValue(error?.response?.data);
        }
    });
    และส่ง payload (email, password) ไปพร้อมกับ action
    
    มีการตรวจ error โดยค่า error มาจากไฟล์ usersSlice.js        
    //get data from store
        const {error, loading, userInfo} = useSelector(
            (state) => state?.users?.userAuth
    );
    {error && <ErrorMsg message={error?.message}/>}

    มีการตรวจ loading โดยค่า loading มาจากไฟล์ usersSlice.js
    {loading ? 
        <LoadingComponent/>
        :
        <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
            Login
        </button>
    }

        import React, { useState } from "react";
        import {useDispatch, useSelector} from 'react-redux';
        import {loginUserAction} from '../../../redux/slices/users/usersSlice.js'
        import ErrorMsg from '../../ErrorMsg/ErrorMsg.js'
        import LoadingComponent from "../../LoadingComp/LoadingComponent.js";

        const Login = () => {
        //dispath
        const dispatch = useDispatch();
        const [formData, setFormData] = useState({
            email: "admin@gmail.com",
            password: "12345",
        });
        //---Destructuring---
        const { email, password } = formData;
        //---onchange handler----
        const onChangeHandler = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        //---onsubmit handler----
        const onSubmitHandler = (e) => {
            e.preventDefault();
            console.log(email, password);

            dispatch(loginUserAction({email, password}));
        };

        //get data from store
        const {error, loading, userInfo} = useSelector(
            (state) => state?.users?.userAuth
        );

        // if(userInfo?.userFound?.isAdmin){
        //   window.location.href = '/admin'
        // }else{
        //   window.location.href = '/customer-profile'
        // }

        return (
            <>
            <section className="py-20 bg-gray-100 overflow-x-hidden">
                <div className="relative container px-4 mx-auto">
                <div className="absolute inset-0 bg-blue-200 my-24 -ml-4" />
                <div className="relative flex flex-wrap bg-white">
                    <div className="w-full md:w-4/6 px-4">
                    <div className="lg:max-w-3xl mx-auto py-20 px-4 md:px-10 lg:px-20">
                        <h3 className="mb-8 text-4xl md:text-5xl font-bold font-heading">
                        Login to your account
                        </h3>
                        <p className="mb-10 font-semibold font-heading">
                        Happy to see you again
                        </p>
                        {error && <ErrorMsg message={error?.message}/>}
                        <form
                        className="flex flex-wrap -mx-4"
                        onSubmit={onSubmitHandler}>
                        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-12">
                            <label>
                            <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                                Your Email
                            </h4>
                            <input
                                name="email"
                                value={email}
                                onChange={onChangeHandler}
                                className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                                type="email"
                            />
                            </label>
                        </div>
                        <div className="w-full md:w-1/2 px-4 mb-12">
                            <label>
                            <h4 className="mb-5 text-gray-400 uppercase font-bold font-heading">
                                Password
                            </h4>
                            <input
                                name="password"
                                value={password}
                                onChange={onChangeHandler}
                                className="p-5 w-full border border-gray-200 focus:ring-blue-300 focus:border-blue-300 rounded-md"
                                type="password"
                            />
                            </label>
                        </div>

                        <div className="w-full px-4">
                            {loading ? 
                            <LoadingComponent/>
                            :
                            <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold font-heading py-5 px-8 rounded-md uppercase">
                            Login
                            </button>}
                        </div>
                        </form>
                    </div>
                    </div>
                    <div
                    className="w-full md:w-2/6 h-128 md:h-auto flex items-center lg:items-end px-4 pb-20 bg-cover bg-no-repeat"
                    style={{
                        backgroundImage:
                        'url("https://cdn.pixabay.com/photo/2017/03/29/04/47/high-heels-2184095_1280.jpg")',
                    }}></div>
                </div>
                </div>
            </section>
            </>
        );
        };

        export default Login;

13. create productSlices, brandsSlice, categoriesSlice, colorsSlice

    src > redux > slices > products > productSlices.js
    
    src > components > Admin > AddProduct.js
    src > components > HomePage > HomeProductTrending.js
    src > components > Users > Products > Product.js

14. CategoryToAdd.js, AddCategory.js (เพิ่ม upload image), categoriesSlice(add resetErrAction, resetSuccessAction)

15. จัดการ product category ใน Navbar, HomeCategories, All Categories

16. Products filter page (fetch color, brand, size, products from slice)

17. cartSlices(add product to cart localstorage, get product from localstorage, remove product in localstorage, change order in localstorage)

18. product.js -> when click button add product to cart (get product from localstorage and set new state in cartSlices.js)

19. couponSlice(create, reset, fetch all, fetch single)

20. shoppingCart.js (check coupon) and (send attribute to next page and save in location.state(สำหรับค่าที่ไม่ต้องการเก็บใน localstorage))

21. orderPayment.js

22. usersSlice(updateShippingAddress)

23. AddShippingAddress.js(updateAddress)

24. OrderPayment.js, ThanksForOrdering.js (App route success)

25. Product.js (check qtyLeft)

26. reviewSlice, AddReview.js

27. customerProfile.js, manageStocks.js

28. OrdersList.js, orderSlices(ordersStatsAction)

29. OrdersStatistics.js, UpdateOrders.js

30. customer.js

31. AddCoupon.js, manageCoupons.js(update, delete), updateCoupon.js

32. ManageCategories.js, BrandsList.js, ColorsList.js

33. logoutaction in usersSlice.js

34. frontend netlify, backend render baseURL(https://e-commerce-mern-tutorial.onrender.com) /api/v1/products








            



            



