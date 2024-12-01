// router/index.ts
import { createRouter, createWebHistory } from 'vue-router/auto';
import { routes } from 'vue-router/auto-routes';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Adicionando a guarda de rota
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();
  
  // Verificando se a rota requer autenticação
  if (to.meta.requiresAuth) {
    try {
      const user = await new Promise<any>((resolve, reject) => {
        onAuthStateChanged(auth, resolve, reject)
      })
      
      if (user) {
        next() // Permite acesso se o usuário estiver autenticado
      } else {
        next('/login') // Redireciona para a página de login se não autenticado
      }
    } catch (error) {
      console.error("Erro ao verificar o estado de autenticação:", error)
      next('/login') // Redireciona para login em caso de erro na autenticação
    }
  } else {
    next() // Se a rota não exigir autenticação, permite o acesso
  }
});

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error');
      localStorage.setItem('vuetify:dynamic-reload', 'true');
      location.assign(to.fullPath);
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload');
});

export default router;
