<template>
    <div id="produtos" >
      
      <v-skeleton-loader class="w-100 d-flex mt-7 mb-7 flex-wrap justify-center" style="gap: 10px;background: rgba(0,0,0,0);" :loading="loading" type="card" >
        
        <v-card
          class="mb-5"
          max-width="200"
          min-width="200"
          v-for="(item) in produtosExibir"
          :key="item.id_prod"
          :elevation="3"
        >
        <v-skeleton-loader  :loading="loading" type="card" >
          <v-badge
          color="red"
          overlap
          content="Destaque"
          class="badge-destaque"
          v-if="item.destaque"
        ></v-badge>
          <v-img
            @click="openModal(item)"
            role="button"
            class="cursor-pointer"
            height="155px"
            :src="item.img"
            cover
            
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
              :href="`https://wa.me/558699700524?text=Olá%2C%20gostaria%20de%20saber%20mais%20informações%20do%20Item:%0A%0A*${item.nome}*%0A%0AValor:%20${!dollarOn ? 'R$': '$'}%20${!dollarOn ? item.valor: item.valorDollar}%0A%0A${domain}/produtos/${item.id_prod}%0A%0A_Obrigado!_`"
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
    <v-dialog v-model="modalOpen" max-width="780px">
      <v-card>
        <v-img
          v-if="selectedProduct"
          :src="selectedProduct.img"
          max-height="500"
        ></v-img>
        <v-card-title>{{ selectedProduct?.nome }}</v-card-title>
        <v-card-actions>
          <v-btn color="red" text="true" @click="modalOpen = false">Fechar</v-btn>
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
            <v-btn color="red" text='true' @click="modalOpenVideo = false">Fechar</v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, PropType, watch } from 'vue';

type Produto = {
  id_prod: string;
  nome: string;
  img: string;
  video: string;
  valor: number;
  valorDollar: number;
  categoria_id: string;
  destaque?: boolean;
};

const loading = ref(true);
const modalOpen = ref(false);
const selectedProduct = ref<Produto | null>(null);
const modalOpenVideo = ref(false);
const dollarOn = ref(false);
const domain = ref("");

onMounted(() => {
  if (typeof window !== "undefined") {
    domain.value = window.location.origin;
  }
});

function openModal(item: Produto) {
  selectedProduct.value = item;
  modalOpen.value = true;
}

function openModalVide(item: Produto) {
  selectedProduct.value = item;
  modalOpenVideo.value = true;
}

function extractVideoId(url: string): string {
  const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  return videoIdMatch ? videoIdMatch[1] : '';
}

const props = defineProps({
  produtosExibir: {
    required: true,
    type: Array as PropType<Produto[]>
  }
});

watch(() => props.produtosExibir, (newVal) => {
  if (newVal) {
    loading.value = false;
  }
});
</script>


<style scoped>
.badge-destaque {
  position: absolute;
  top: 10px; /* 142 */
  left: 8px; /* 153 */
  font-weight: bold;
  color: white;
  z-index: 899;
}
</style>