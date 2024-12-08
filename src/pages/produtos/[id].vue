<template>
    <main class="d-flex mt-7 mb-7 flex-wrap justify-center" style="gap: 2rem;">
        <v-card
            min-width="400"
        >
            <v-tabs
        v-model="tab"
        bg-color="secondary"
        >
        <v-tab value="one">Foto</v-tab>
        <v-tab value="two" v-if="produto.video != ''">Vídeo</v-tab>
        </v-tabs>
        <v-card-text>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
                <v-img :src="produto.img" />
            </v-tabs-window-item>

            <v-tabs-window-item value="two" >
                <iframe
                    :src="`https://www.youtube.com/embed/${extractVideoId(produto.video)}`"
                    width="100%"
                    height="400"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    ></iframe>
            </v-tabs-window-item>
        </v-tabs-window>
        </v-card-text>
            
        </v-card>
        <div class="d-flex mt-7 mb-7 flex-column justify-space-between align-end "> 
            <div class="d-flex flex-column">
                <h1 class="text-h3 font-weight-black mb-3 text-teal-darken-4">{{ produto.nome }}</h1>
                <v-divider></v-divider>
                <p class="font-weight-light mt-3 text-indigo-lighten-1">Código: {{ produto.id_prod }}</p>
            </div>
            <div  class="d-flex align-end mb-6 flex-column">
                <p  class="text-h5 font-weight-bold text-teal-darken-2 mb-3">Valor: R$ {{ produto.valor }}</p>
                <v-divider></v-divider>
                <v-btn class="mt-3" color="green" height="50" prepend-icon="mdi-whatsapp" width="320"
                :href="`https://wa.me/558699700524?text=Olá%2C%20gostaria%20de%20saber%20mais%20informações%20do%20Item:%0A%0A*${produto.nome}*%0A%0AValor:%20R$%20${produto.valor}%0A%0Ahttp://10.0.0.2:3000/produtos/${produto.id_prod}%0A%0A_Obrigado!_`"
                target="_blank"
                variant="flat"
                >
                    Tenho interesse
                </v-btn>
            </div>
        </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, inject } from 'vue';
  import { useRoute } from 'vue-router';
  import { Products } from '@/models/entities/Products';
  import { IProductsControllers } from '@/controllers/interfaces/IProductsControllers';

  const productsControllers = inject<IProductsControllers>('productsControllers');
    if (!productsControllers) {
      throw new Error('AuthUserControllers not provided');
    }

  const produto = ref<Products>({
      id_prod: '',
      nome: '',
      img: '',
      video: '',
      valor: 0,
      categoria_id: '',
      destaque:false
    })

  definePage({
    meta:{
      layout: 'DefaultLayout'
    }
  })
  const route = useRoute();

  const initialize = async () => {
    const id = route.params.id as string
    const produtoNew = await productsControllers.getProductId(id)
    if(produtoNew != undefined){
      produto.value = produtoNew
    }
  };

      
      const tab = ref(null)
  
      function extractVideoId(url:string) {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
        return videoIdMatch ? videoIdMatch[1] : ''

        }
      onMounted(() => {
        initialize()
      });
  
  </script>

  