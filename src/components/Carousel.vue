<template>
    <header id="carrosel">
    <div class="d-flex justify-end flex-wrap-reverse">
    <div class="d-flex justify-center flex-grow-1 flex-shrink-0" style="min-width: 100px; max-width: 100%;">
      <v-skeleton-loader min-height="300" min-width="800px" :loading="loading" type="ossein" >

      
      <v-carousel
        id="carousel-principal"
        class="me-7 mt-7 mb-6"
        height="300"
        :show-arrows="false"
        cycle
        hide-delimiter-background
        style="max-width: 800px; background: rgba(0,0,0,0);"
      >
      
        <v-carousel-item
          v-for="(item, index) in carouselImages"
          :key="index"
          
        >
          <v-sheet
            color="rgba(0,0,0,0)"
            height="100%"
          >
            <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">
                <v-card 
                  min-width="700"
                >
                  <v-img :aspect-ratio="1" :src="item.img" />
                </v-card>
              </div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-skeleton-loader>
    </div>

    <v-skeleton-loader height="300" min-width="300px" :loading="loadingAnuncio" type="ossein" >
      <v-sheet
          class="ms-7 mt-7 mb-6"
          style="background: rgba(0,0,0,0);"
          min-width="300"
        >
        <v-carousel
        height="300"
        :show-arrows="false"
        cycle
        hide-delimiter-background
        style="max-width: 300px;"
        
      >
        <v-carousel-item
          v-for="(item, index) in anuncios"
          :key="index"
          
        >
          <v-sheet
            color="rgba(0,0,0,0)"
            height="100%"
          >
            <div class="d-flex fill-height justify-center align-center">
              <div class="text-h2">
                <v-card 
                  max-width="400"
                  min-width="450"
                  
                >
                  <v-img :src="item.img">
                  </v-img>
                </v-card>
              </div>
            </div>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      </v-sheet>
    </v-skeleton-loader>
    </div>
      
  </header>
</template>


<script setup lang="ts">
import { Anuncio } from '@/models/entities/Anuncio';
import { Banners } from '@/models/entities/Banners';
import { ref,computed, onMounted, onBeforeUnmount, PropType, watch } from 'vue';
const loading = ref(true)
const loadingAnuncio = ref(true)
const windowWidth = ref(window.innerWidth);
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const props = defineProps({
    carousel:{
        type: Array as PropType<Banners[]>
    },
    anuncios:{
        type:Array as PropType<Anuncio[]>
    }

})

if(!props.carousel){
  throw "Não encontrei"
}
if(!props.anuncios){
  throw new Error('Não encontrei')
}
const carousel = ref<Banners[]>([])
const anuncios = ref<Anuncio[]>([])

watch(() => props.carousel, (newVal) => {
  if (newVal && newVal.length > 0) {
    carousel.value = newVal;
    loading.value = false; // Pare o carregamento quando os dados chegarem
  }
});

watch(() => props.anuncios, (newVal) => {
  if (newVal && newVal.length > 0) {
    anuncios.value = newVal;
    loadingAnuncio.value = false
  }
});

const carouselImages = computed(() => {
    return carousel.value.map(item => {
      
      return {
        img: window.innerWidth >= 450 ? item.imgDesktop : item.imgMobile
      };
    });
  });
// Adiciona o listener para o evento resize ao montar o componente
onMounted(() => {
    window.addEventListener('resize', updateWindowWidth);
    if (props.carousel && props.carousel.length > 0) {
    carousel.value = props.carousel;
    loading.value = false;
  }
  if (props.anuncios && props.anuncios.length > 0) {
    anuncios.value = props.anuncios;
    loadingAnuncio.value = false
  }
  });
  // Remove o listener ao desmontar o componente
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
  });
</script>

<style scoped>
  @media (max-width: 1060px) {
    /* Seus estilos aqui */
    #carrosel div{
      justify-content: center !important;
      margin: 5px 0px 5px 0px !important;
      
    }
    #carousel-principal{
      max-width: 100% !important;
    }
    @media (max-width: 450px) {
    #carrosel div{
      justify-content: center !important;
      margin-top: 15px !important;
      
    }
    #carousel-principal {
      margin: 0 auto; /* Centraliza no mobile */
      height: auto; /* Ajusta altura dinamicamente */
      max-width: 400px !important;
    }
  }
}
</style>