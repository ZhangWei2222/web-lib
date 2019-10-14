import Vue from 'vue'
import Router from 'vue-router'
import Book from '@/components/book'
import User from '@/components/user'
import Admin from '@/components/admin'
import Borrow from '@/components/borrow'
import Ticket from '@/components/ticket'
import Return from '@/components/return'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/book'
    },
    {
      path: '/book',
      name: 'Book',
      component: Book
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    },
    {
      path: '/borrow',
      name: 'Borrow',
      component: Borrow
    },
    {
      path: '/ticket',
      name: 'Ticket',
      component: Ticket
    },
    {
      path: '/return',
      name: 'Return',
      component: Return
    }
  ]
})
