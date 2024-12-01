<template>
    <v-container  class="bg-surface-variant">
      <v-row
          align="center"
          justify="center"
          style="height: 150px;"
          no-gutters
        >
          <v-col
            v-for="n in 3"
            :key="n"
          >
            <v-sheet class="pa-2 ma-2">
              teste
            </v-sheet>
          </v-col>
        </v-row>
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
  