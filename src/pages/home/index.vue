<template>
    <v-container  class="d-flex justify-center align-center" style="height: 100dvh;">
      <div>
        <p>Em Desenvolvimento ...</p>
      </div>
    </v-container>
  </template>
  
  <script setup lang="ts">
    import { IAuthUserControllers } from '@/controllers/interfaces/IAuthUserControllers';
    import { ref, inject, onBeforeMount } from 'vue';

    definePage({
      meta: {
        requiresAuth: true,  // Indica que a rota requer autenticação
      }
    })
    // Usando o Vue Router para navegação
    const authUserControllers = inject<IAuthUserControllers>('authUserControllers');
    if (!authUserControllers) {
      throw new Error('AuthUserControllers not provided');
    }
    const usuario = ref<{} | null>(null)
    const idUser = ref<string | null>(null)

    const getidUser = async () =>{
      idUser.value = await authUserControllers.getIdUser()
    }

    const getUser = async () =>{
      const id = idUser.value
      if (id != null){
        const user = await authUserControllers.getUserId(id)
        usuario.value = user
      }
    }

    onBeforeMount(async()=>{
      await getidUser();
      await getUser();
    })


  </script>
  