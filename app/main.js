require("bootstrap-sass/assets/javascripts/bootstrap.js")
import Vue from 'vue';
import Router from 'vue-router'
import App from './app.vue'
import PageA from './views/view-a.vue'
import PageB from './views/view-b.vue'
import './main.scss';

// install router
Vue.use(Router)

// debug mode
Vue.config.debug = true

// strict mode
Vue.config.strict = true
// var app = new Vue(require('./app.vue'))
var router = new Router({
	hashbang: true,
	history: false
})

router.map({
	'/pagea/': {
		component: PageA
	},
	'/pageb/': {
		component: PageB
	}
})

router.redirect({
	'*': '/pagea'
})

router.start(App, '#app')
