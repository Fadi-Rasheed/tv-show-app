import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/home/Home.vue')
const ShowDetails = () => import('@/views/show-details/ShowDetails.vue')
const Search = () => import('@/views/search/Search.vue')
const Browse = () => import('@/views/browse/Browse.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/show-details/:id',
      name: 'show-details',
      component: ShowDetails,
      props: true,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/browse/:category',
      name: 'browse',
      component: Browse,
      props: true,
    },
  ],
})
