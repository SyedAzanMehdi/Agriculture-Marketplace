/**
 * AgriConnect – SPA Entry Point
 */
import { store } from './src/core/state.js';
import { api } from './src/api/client.js';
import { $, debounce, initLazyLoading, initScrollAnimations } from './src/core/utils.js';

// Import Pages
import { Home } from './src/pages/Home.js';
import { Marketplace } from './src/pages/Marketplace.js';
import { Dashboard } from './src/pages/Dashboard.js';
import { Login, Register } from './src/pages/Auth.js';

const pages = {
    home: Home,
    marketplace: Marketplace,
    dashboard: Dashboard,
    login: Login,
    register: Register
};

// Global Event Dispatcher
window.dispatch = (action, ...args) => {
    const actions = {
        navigate: (page) => {
            store.setState({ currentPage: page });
            window.scrollTo(0, 0);
        },
        logout: () => {
            store.setState({ user: null });
            localStorage.removeItem('agri_user');
            window.dispatch('navigate', 'home');
        },
        toggleMobileNav: () => {
            $('#mobileOverlay')?.classList.toggle('open');
            $('#mobilePanel')?.classList.toggle('open');
        },
        // Add more global actions here...
    };

    if (actions[action]) actions[action](...args);
    else console.warn(`Action ${action} not found`);
};

// Main Render Function
const render = () => {
    const { currentPage } = store.state;
    const PageComponent = pages[currentPage] || Home;
    
    $('#app').innerHTML = PageComponent();
    
    // Post-render initializations
    initLazyLoading();
    initScrollAnimations();
};

// Initialize App
const init = async () => {
    try {
        const data = await api.get('getData');
        store.setState({
            crops: data.crops || [],
            offers: data.offers || []
        });
        window.USERS_DATA = data.users || [];
    } catch (error) {
        console.error("Initialization failed:", error);
    }

    // Subscribe to state changes
    store.subscribe(() => render());

    // Initial render
    render();
};

document.addEventListener('DOMContentLoaded', init);

// Handle scroll for navbar styling
window.addEventListener('scroll', debounce(() => {
    const nav = $('#navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
}, 10));
