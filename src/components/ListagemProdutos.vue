<template>
    <div id="produtos" >
      
      <v-skeleton-loader class="w-100 d-flex mt-7 mb-7 flex-wrap justify-center" style="gap: 10px;background: rgba(0,0,0,0);" :loading="loading" type="card" >
        
        <v-card
          class="mb-5"
          max-width="200"
          min-width="200"
          v-for="(item, index) in produtosExibir"
          :key="item.id_prod"
          :elevation="3"
        >
        <v-skeleton-loader  :loading="loading" type="card" >
          <v-img
            @click="openModal(item)"
            role="button"
            class="cursor-pointer"
            height="200px"
            :src="item.img"
            
          ></v-img>
        </v-skeleton-loader>
          <v-card-title v-if="!loading">
            {{ item.nome }}
          </v-card-title>
        
          <v-card-subtitle >
            <div class="d-flex justify-space-between align-center">
              <p v-if="!dollarOn">Preço: R$ {{ item.valor }}</p>
              <p v-else>Price: $ {{ item.valorDollar }}</p>
              <v-tooltip :text="!dollarOn ? 'Price in dollar': 'Preço em reais'">
                <template v-slot:activator="{ props }">
                  <v-btn 
                  @click="()=> dollarOn = !dollarOn"
                  variant="flat"
                  icon="mdi-swap-horizontal"
                  v-bind="props"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
            
          </v-card-subtitle>
  
          <v-card-actions>
            <v-btn
              text="Comprar"
              color="green"
              variant="flat"
              :href="`https://wa.me/558699700524?text=Olá%2C%20gostaria%20de%20saber%20mais%20informações%20do%20Item:%0A%0A*${item.nome}*%0A%0AValor:%20R$%20${item.valor}%0A%0Ahttps://10.0.0.2:3000/produtos/${item.id_prod}%0A%0A_Obrigado!_`"
              target="_blank"
            ></v-btn>
  
            <v-btn
              v-if="item.video != ''"
              text="Video"
              color="red"
              variant="flat"
              @click="openModalVide(item)"
            ></v-btn>
          </v-card-actions>
        
        </v-card>
      </v-skeleton-loader>
      
      <!-- Modal para exibir a imagem em tamanho grande -->
    <v-dialog v-model="modalOpen" max-width="600px">
      <v-card>
        <v-img
          v-if="selectedProduct"
          :src="selectedProduct.img"
          max-height="500"
        ></v-img>
        <v-card-title>{{ selectedProduct?.nome }}</v-card-title>
        <v-card-actions>
          <v-btn color="red" text @click="modalOpen = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        <!-- Modal para exibir o vídeo do YouTube -->
      <v-dialog v-model="modalOpenVideo" max-width="800px">
        <v-card>
          <v-card-title>{{ selectedProduct?.nome }}</v-card-title>
          <v-card-text>
            <!-- Renderiza o vídeo se o link for fornecido -->
            <iframe
              v-if="selectedProduct?.video"
              :src="`https://www.youtube.com/embed/${extractVideoId(selectedProduct.video)}`"
              width="100%"
              height="400"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" text @click="modalOpenVideo = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script setup>
    import { ref, watch } from 'vue';
    const loading = ref(true)
    const modalOpen = ref(false)
    const selectedProduct = ref(null)
    const modalOpenVideo = ref(false)
    const dollarOn = ref(false)
    // Função para abrir o modal com o produto selecionado
    function openModal(item) {
        selectedProduct.value = item
        modalOpen.value = true
    }
    function openModalVide(item) {
        selectedProduct.value = item
        modalOpenVideo.value = true
    }
    function extractVideoId(url) {
        const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
        return videoIdMatch ? videoIdMatch[1] : ''
    }
    const props = defineProps({
        produtosExibir:{
            required:true,
        }
    })
    watch(props, (val)=>{
      console.log(val)
      if(val.produtosExibir != null){
        loading.value = false
      }
    })
</script>