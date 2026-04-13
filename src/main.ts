import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/style.css';

if (import.meta.env.PROD) {
  const script = document.createElement('script');
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

createApp(App).use(router).mount('#app');
