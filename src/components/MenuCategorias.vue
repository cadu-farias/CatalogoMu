<template>
    <div id="menu-categorias" >
      <v-sheet
        class="mx-auto d-flex justify-center bg-surface-variant"
      >
        <v-slide-group
          show-arrows
        >
          <v-slide-group-item
          >
            <v-btn
              class="ma-2"
              rounded
              base-color="black"
              :color="categoriaSelecionada === null ? 'primary' : undefined"
              @click="filtrarPorCategoria(null)"
              >
              Todos
            </v-btn>
            <v-btn
              v-for="n in categorias"
               :key="n.id_category"
               :color="categoriaSelecionada === n.id_category ? 'primary' : undefined"
                class="ma-2"
                rounded
                base-color="black"
              
              @click="filtrarPorCategoria(n.id_category)"
            >
              {{ n.nome }}
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>
      </v-sheet>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { CategoryProducts } from '@/models/entities/CategoryProducts';

const props = defineProps({
    categorias:{
      required:true
    },
    categoriaSelecionada:{
        required:true
    },
    filtrarPorCategoria:{
        type:Function,
        required:true
    }

})


</script>