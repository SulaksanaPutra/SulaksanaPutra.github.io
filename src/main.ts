import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/style.css';

const initGA = () => {
    if (import.meta.env.PROD && !document.getElementById('gtm-script')) {
        const script = document.createElement('script');
        script.id = 'gtm-script';
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LQ4FV2KJX5';
        document.head.appendChild(script);

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function () {
            (window as any).dataLayer.push(arguments);
        };
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', 'G-LQ4FV2KJX5');
    }
};

if (import.meta.env.PROD) {
    const consent = localStorage.getItem('cookie-consent-status');
    if (consent === 'accepted') {
        initGA();
    } else {
        window.addEventListener('cookie-consent-accepted', () => {
            initGA();
        });
    }
}

createApp(App).use(router).mount('#app');
