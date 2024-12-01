<template>
      <header id="carrosel">
    <div class="d-flex justify-end flex-wrap-reverse">
      
      <v-carousel
      id="carousel-principal"
      class="me-7 mt-7 mb-6"
      height="300"
      :show-arrows="false"
      cycle
      hide-delimiter-background
      style="max-width: 700px; background: rgba(0,0,0,0);"
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
              <v-skeleton-loader height="300" :loading="loading" type="ossein" >
                <v-img :aspect-ratio="1" :src="item.img" />
              </v-skeleton-loader>
              </v-card>
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
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
              <v-skeleton-loader height="300" :loading="loading" type="ossein" >
                <v-img :src="item.img">
                </v-img>
              </v-skeleton-loader>
              </v-card>
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
      </v-sheet>
    </div>
      
  </header>
</template>


<script setup>
import { ref,computed, onMounted, onBeforeUnmount, watch } from 'vue';
const loading = ref(true)
const windowWidth = ref(window.innerWidth);
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const props = defineProps({
    carousel:{
        required: true
    },
    anuncios:{
        required:true
    }

})

const carousel = ref(props.carousel)

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
  });
  // Remove o listener ao desmontar o componente
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWindowWidth);
  });
  setTimeout(()=>{
    loading.value = false
  },500)
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
}
</style>