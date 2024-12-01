<template>
    <v-data-table
      :headers="headers"
      v-model:search="search"
      :filter-keys="['nome','id_prod']"
      :items="desserts"
      :sort-by="[{ key: 'id_prod', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-card>
         <v-toolbar flat><v-toolbar-title>Listagem Categorias</v-toolbar-title></v-toolbar>
        </v-card>
        <v-divider inset :opacity="0.1"></v-divider>
        <v-toolbar flat>
          
          <v-text-field
          v-model="search"
          density="compact"
          label="Buscar por id ou nome"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
        ></v-text-field>
          <v-divider class="mx-2" inset vertical></v-divider>
  
          <!-- Botão Novo Produto -->
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2" color="primary" dark v-bind="props" variant="elevated">
                Novo Categoria
              </v-btn>
            </template>
  
            <!-- Formulário de Edição -->
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-text-field v-model="editedItem.nome" label="Nome Categoria"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
          <!-- Dialog de Exclusão -->
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Tem certeza em remover essa categoria?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
  
      <!-- Ações da Tabela -->
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </template>
  
  <script setup lang="ts">
  import { IProductsControllers } from '@/controllers/interfaces/IProductsControllers';
  import { CategoryProducts } from '@/models/entities/CategoryProducts';
  import { ref,inject, computed, watch, onMounted, nextTick,onUnmounted } from 'vue';

  const productsControllers = inject<IProductsControllers>('productsControllers');
    if (!productsControllers) {
      throw new Error('AuthUserControllers not provided');
    }


  definePage({
      meta: {
        requiresAuth: true,  // Indica que a rota requer autenticação
      }
    })
  // Refs e reativas
  const dialog = ref(false);
  const search = ref('');
  const dialogDelete = ref(false);

  

  const headers:any = [
    {
      title: 'ID',
      align: 'start',
      key: 'id_category',
    },
    { title: 'Nome Categoria', key: 'nome' },
    { title: 'Ações Categoria', key: 'actions', align: 'center', sortable: false },
  ];
  
  const desserts = ref<CategoryProducts[]>();
  const editedIndex = ref<boolean>(false);
  
  const editedItem = ref<CategoryProducts>({
    id_category:'',
    nome:'',
  });

  const itemPadrao = ref<CategoryProducts>({
    id_category:'',
    nome:'',
  });

  // Computed
  const formTitle = computed(() =>
    
    editedIndex.value === false ? 'Novo Categoria' : 'Editar Categoria'
  );
  
  // Watchers
  watch(dialog, (val) => {
    if (!val) close();
  });

  watch(dialogDelete, (val) => {
    if (!val) closeDelete();
  });
  
  // Métodos
  const initialize = async () => {
    await productsControllers.lerTodasCategorias('cadastroCategorias', (categories:CategoryProducts[]) => {
        console.log(categories);
        desserts.value = categories; // Atualiza automaticamente o array de categorias
    });
  }
  const editItem = (item:CategoryProducts) => {
    editedIndex.value = true
    editedItem.value = item
    dialog.value = true;
  };
  
  const deleteItem = (item:CategoryProducts) => {
        editedIndex.value = true
        editedItem.value = item
        dialogDelete.value = true;
  };
  
  const deleteItemConfirm = async () => {
    if(editedItem.value != null){
      await productsControllers.deletarCategoria(editedItem.value.id_category)
      closeDelete();
        
    }
  };
  
  const close = () => {
    dialog.value = false;
    nextTick(() => {
        editedItem.value = itemPadrao.value
        editedIndex.value = false
    });
  };
  
  const closeDelete = () => {
    dialogDelete.value = false;
    nextTick(() => {
        editedItem.value = itemPadrao.value
        editedIndex.value = false
    });
  };
  
  const save = async () => {
    if (editedIndex.value && editedItem.value != null) {
        await productsControllers.editarCategoria(editedItem.value.id_category,editedItem.value.nome)
    }else if(editedItem.value != null){
        await productsControllers.cadastrarCategoria(editedItem.value?.nome)
    }
    close();
  };
  
  // Lifecycle
  onMounted(() => {
    initialize();
  });

onUnmounted(() => {
  productsControllers.stopListeningCategory('cadastroCategorias')
});

  </script>
  