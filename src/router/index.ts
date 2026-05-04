import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/home/Home.vue')
const ShowDetails = () => import('@/views/show-details/ShowDetails.vue')
const Search = () => import('@/views/search/Search.vue')
const Browse = () => import('@/views/browse/Browse.vue')
const NotFound = () => import('@/views/not-found/NotFound.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/browse',
      name: 'browse',
      component: Browse,
    },
    {
      path: '/show-details/:id',
      name: 'show-details',
      component: ShowDetails,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})
