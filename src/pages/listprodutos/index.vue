<template>
 
  <v-data-table
    :headers="headers"
    v-model:search="search"
    :filter-keys="['nome','id_prod']"
    :items="desserts"
    :sort-by="[{ key: 'id_prod', order: 'asc' }]"
  >
    <!-- Formatar a coluna de imagem -->
    <template v-slot:item.img="{ item }">
      <v-card width="64" class="my-2" elevation="2" rounded>
        <v-img
          :src="item.img"
          height="64"
          cover
        ></v-img>
      </v-card>
      
    </template>

    <!-- Formatar a coluna de preço com R$ -->
    <template v-slot:item.valor="{ item }">
      <span class="text-teal-darken-3">R$ {{ item.valor }}</span>
    </template>

    <template v-slot:top>
      <v-card>
       <v-toolbar flat><v-toolbar-title>Listagem Produtos</v-toolbar-title></v-toolbar>
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
              Novo Produto
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
                    <v-text-field v-model="editedItem.nome" label="Nome Produto"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                    v-model="editedItem.valor"
                    label="Preço"
                    prepend-inner-icon="mdi-currency-brl"
                    :hide-details="false"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.img" label="Link Imagem"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="editedItem.video" label="Link Vídeo"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12">
                    <v-select
                    v-model="editedItem.categoria_id"
                    label="Select"
                    :hint="`${select?.nome || ''}`"
                    :items="categorias"
                    item-title="nome"
                    item-value="id_category"
                    persistent-hint
                    single-line
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">Cancelar</v-btn>
              <v-btn :loading="loading" color="blue-darken-1" variant="text" @click="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Dialog de Exclusão -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Tem certeza em remover esse produto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue-darken-1" :loading="loading" variant="text" @click="deleteItemConfirm">OK</v-btn>
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
import { CategoryProducts } from '@/models/entities/CategoryProducts';
import { Products } from '@/models/entities/Products';
import { ref,inject, computed, watch,onUnmounted } from 'vue';
import { IProductsControllers } from '@/controllers/interfaces/IProductsControllers';

  const productsControllers = inject<IProductsControllers>('productsControllers');
    if (!productsControllers) {
      throw new Error('AuthUserControllers not provided');
    }

  definePage({
    meta: {
      requiresAuth: true,  // Indica que a rota requer autenticação
    }
  })

// Variáveis reativas
const dialog = ref(false);
const search = ref('');
const dialogDelete = ref(false);
const loading = ref(false)

const headers:any = [
  { title: 'ID', align: 'start', key: 'id_prod' },
  { title: 'Nome Produto', key: 'nome' },
  { title: 'Imagem', key: 'img', sortable: false },
  { title: 'Valor', key: 'valor', sortable: false },
  { title: 'Ações Produto', key: 'actions', align: 'center', sortable: false },
];

const desserts = ref<Products[]>([]);
const editedIndex = ref<boolean>(false);

const editedItem = ref<Products>({
  id_prod: '',
  nome: '',
  img: '',
  video: '',
  valor: 0,
  categoria_id: '',
  destaque:false
});

const defaultItem = ref<Products>({
  id_prod: '',
  nome: '',
  img: '',
  video: '',
  valor: 0,
  categoria_id: '',
  destaque:false
});

const categorias = ref<CategoryProducts[]>();

// Computed
const formTitle = computed(
  () => (editedIndex.value ? 'Novo Produto' : 'Editar Produto')
);

const select = computed({
  get: () => {if (categorias.value != undefined) return categorias.value.find((cat) => cat.id_category === editedItem.value.categoria_id)},
  set: (newValue) => {
    return newValue?.id_category
  },
});
// Watchers
// Atualiza `select` com a categoria correspondente a `editedItem.categoria_id`
watch(
  
  () => editedItem.value.categoria_id,
  (newId) => {
    console.log(editedItem)
    console.log(newId)
    if(categorias.value != undefined){
      const selectedCategory = categorias.value.find(
        (categoria) => categoria.id_category === newId
      );
      select.value = selectedCategory || { id_category: '', nome: 'Selecione' };
    }
  }
);


watch(dialog, (val) => {
  if (!val) close();
});

watch(dialogDelete, (val) => {
  if (!val) closeDelete();
});

// Métodos
const initialize = async () => {
  await productsControllers.lerTodasCategorias('cadastroiCategorias', (categories:CategoryProducts[]) => {
        console.log(categories);
        categorias.value = categories; // Atualiza automaticamente o array de categorias
    });

  await productsControllers.getAllProducts('lerProdutos', (products:Products[])=>{
    console.log(products)
    desserts.value = products
  })
};

const editItem = (item:Products) => {
  console.log(select.value)
  editedIndex.value = true
  editedItem.value = item
  dialog.value = true;
};

const deleteItem = (item:Products) => {
  editedIndex.value = true
  editedItem.value = item
  dialogDelete.value = true;
};

const deleteItemConfirm = async() => {
  loading.value = true;
  await productsControllers.deleteProduct(editedItem.value.id_prod)
  closeDelete();
  loading.value = false;
};

const close = () => {
  dialog.value = false;
  editedItem.value = defaultItem.value
  editedIndex.value = false
};

const closeDelete = () => {
  dialogDelete.value = false;
  editedItem.value = defaultItem.value
  editedIndex.value = false
};

const save = async () => {
  loading.value = true;
  if (editedIndex.value) {
    await productsControllers.editProduct(editedItem.value)
    loading.value = false;
  } else {
    await productsControllers.createProduct(editedItem.value.nome,editedItem.value.img, editedItem.value.video, editedItem.value.valor, editedItem.value.categoria_id, editedItem.value.destaque)
    loading.value = false;
  }
  close();
};
onUnmounted(() => {
  productsControllers.stopListeningProducts('lerProdutos')
  productsControllers.stopListeningCategory('cadastroiCategorias')
});

// Inicialização
initialize();
</script>
