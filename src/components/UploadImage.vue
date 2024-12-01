<template>
    <v-container>
      <v-card class="mx-auto" max-width="344">
        <!-- Área da Imagem -->
        <v-img
          :src="localImagemProduto"
          aspect-ratio="1"
          class="cursor-pointer"
          @click="triggerFileUpload"
        >
          <template #placeholder>
            <v-icon color="grey darken-1" size="64">mdi-image-off</v-icon>
          </template>
        </v-img>
  
        <!-- Input Invisível para Upload -->
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          class="d-none"
          @change="handleImageUpload"
        />
  
        <!-- Conteúdo da Card -->
        <v-card-title>{{ nomeProduto }}</v-card-title>
        <v-card-subtitle>Clique na imagem para alterar</v-card-subtitle>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    nomeProduto: {
      type: String,
      required: true,
    },
    imagemProduto: {
      type: String,
      default: null,
    },
  });
  
  const emit = defineEmits(['update:imagemProduto']);
  
  // Estado local para manipular a imagem
  const localImagemProduto = ref(props.imagemProduto);
  
  // Atualiza o estado local quando a prop muda
  watch(() => props.imagemProduto, (newVal) => {
    localImagemProduto.value = newVal;
  });
  
  // Referência para o campo de upload
  const fileInput = ref(null);
  
  // Função para abrir o seletor de arquivo
  const triggerFileUpload = () => {
    fileInput.value.click();
  };
  
  // Função para lidar com o upload da imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImage = reader.result;
        localImagemProduto.value = newImage; // Atualiza o estado local
        emit('update:imagemProduto', newImage); // Notifica o pai sobre a alteração
      };
      reader.readAsDataURL(file);
    }
  };
  </script>
  
  <style>
  .cursor-pointer {
    cursor: pointer;
  }
  </style>
  