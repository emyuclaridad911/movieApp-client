import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "notyf/notyf.min.css";
import './style.css';

import { createApp } from 'vue';
import { createPinia } from "pinia";
import App from './App.vue';

import HomePage from "./pages/Home.vue";
import RegisterPage from "./pages/Register.vue";
import LoginPage from "./pages/Login.vue";
import MoviesPage from "./pages/MoviesPage.vue";
import AdminDashboardPage from "./pages/AdminDashboard.vue";
import MovieDetailsPage from "./pages/MovieDetails.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomePage,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterPage,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginPage,
        },
        {
            path: "/movies",
            name: "MoviesPage",
            component: MoviesPage,
        },
        {
            path: "/admin-dashboard",
            name: "AdminDashboard",
            component: AdminDashboardPage,
        },
        {
            path: "/movie/:id",
            name: "MovieDetails",
            component: MovieDetailsPage,
        }
    ]
});

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
