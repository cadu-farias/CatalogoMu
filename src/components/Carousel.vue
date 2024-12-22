<template>
    <header id="carrosel">
    <div class="d-flex justify-end flex-wrap-reverse">
      <v-skeleton-loader v-if="loadingAnuncio" min-height="300px" min-width="300px" :loading="loadingAnuncio" type="ossein" >
      </v-skeleton-loader>
          <v-carousel
          v-if="!loadingAnuncio"
          height="300"
          class="mb-md-6"
          :show-arrows="false"
          cycle
          hide-delimiter-background
          style="max-width: 300px;"
          
        >
          <template
            v-for="item in anuncios"
            :key="item.id"
          >
              <v-carousel-item
                v-if="!item.direction && item.ativo"
              >
                <a :href="item.link" target="_blank">
    
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
                </a>
               
              </v-carousel-item>

          </template>
        </v-carousel>
        
      
    <div class="d-flex justify-center flex-grow-1 flex-shrink-0" style="min-width: 100px; max-width: 100%;">

      <v-skeleton-loader v-if="loading" min-height="300" min-width="600px" :loading="loading" type="ossein" >
      </v-skeleton-loader>  
      
      <v-carousel
        v-if="!loading"
        id="carousel-principal"
        class="mt-7 mb-6"
        height="300"
        :show-arrows="false"
        cycle
        hide-delimiter-background
        style="max-width: 800px; background: rgba(0,0,0,0);"
      >
      <template
      v-for="item in carouselImages"
          :key="item.id"
      >

        <v-carousel-item
          v-if="item.ativo"
          
        >
        <a :href="`https://wa.me/558699700524?text=Olá%2C%20gostaria%20de%20saber%20mais%20informações%20da%0A%0A*${item.nome}*%0A%0A_Obrigado!_`"
        target="_blank">
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
      </a>
        </v-carousel-item>
      </template>
      </v-carousel>
    </div>

    <v-skeleton-loader v-if="loadingAnuncio" min-height="300" min-width="300px" :loading="loadingAnuncio" type="ossein" >
    </v-skeleton-loader>
        <v-carousel
        v-if="!loadingAnuncio"
        height="300"
        class="mb-md-6"
        :show-arrows="false"
        cycle
        hide-delimiter-background
        style="max-width: 300px;"
        
      >
      <template
            v-for="item in anuncios"
            :key="item.id"
          >
              <v-carousel-item
                v-if="item.direction && item.ativo"
              >
                <a :href="item.link" target="_blank">
    
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
                </a>
               
              </v-carousel-item>

          </template>
      </v-carousel>
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
        id:item.id,
        nome:item.nome,
        img: window.innerWidth >= 450 ? item.imgDesktop : item.imgMobile,
        ativo:item.ativo

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
      height: 350px !important; /* Ajusta altura dinamicamente */
      max-width: 400px !important;
    }
  }
}
</style>