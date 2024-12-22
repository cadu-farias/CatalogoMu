<template>
  <Carousel :carousel="carousel" :anuncios="anuncios" />

  <main>
    <MenuCategorias :categorias="categorias"  :filtrarPorCategoria="filtrarPorCategoria" :categoriaSelecionada="categoriaSelecionada" />
    <v-card
        class="mx-auto mt-3"
        max-width="400"
        flat
      >
      <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search templates"
            placeholder="Pesquisar produto"
            persistent-placeholder
            variant="outlined"
            hide-details
            single-line
            flat
            v-model="searchTerm"
            @input="filtrarPorPesquisa"
          ></v-text-field>
      
      </v-card>
    <ListagemProdutos :produtosExibir="produtosExibir !" />

  </main>
</template>

<script setup lang="ts">
import Carousel from '@/components/Carousel.vue';
import MenuCategorias from '@/components/MenuCategorias.vue';
import ListagemProdutos from '@/components/ListagemProdutos.vue';
import { ref,inject,watch,onUnmounted } from 'vue';
import { IProductsControllers } from '@/controllers/interfaces/IProductsControllers';
import { CategoryProducts } from '@/models/entities/CategoryProducts';
import { Products } from '@/models/entities/Products';
import { ICotacaoDollar } from '@/models/services/ICotacaoDollar';
import { Banners } from '@/models/entities/Banners';
import { Anuncio } from '@/models/entities/Anuncio';
import { ISettingsControllers } from '@/controllers/interfaces/ISettingsControllers';

type Produto = {
  id_prod:string;
  nome:string;
  img:string;
  video: string;
  valor:number;
  valorDollar:number;
  categoria_id:string;
  destaque?:boolean;
}

  const productsControllers = inject<IProductsControllers>('productsControllers');
    if (!productsControllers) {
      throw new Error('AuthUserControllers not provided');
    }
  const cotacaoDollarService = inject<ICotacaoDollar>('cotacaoDollar');
  if (!cotacaoDollarService){
    throw new Error('CotacaoDollar not provided');
  }

  const settingsControllers = inject<ISettingsControllers>('settings')
  if(!settingsControllers){
    throw new Error('settings not provided')
  }
  const anuncios = ref<Anuncio[]>([])
  const carousel = ref<Banners[]>([]);

    // Métodos
const initialize = async () => {
  await productsControllers.lerTodasCategorias('cadastroCategorias', (categories:CategoryProducts[]) => {
        categories = categories.filter(item => item.countProducts ! > 0)
        categorias.value = categories; // Atualiza automaticamente o array de categorias
    });

  await productsControllers.getAllProducts('lerProdutos', (products:Products[])=>{
    produtos.value = products
  })

  await settingsControllers.readBanner((banners:Banners[])=>{
    carousel.value = banners
  })

  await settingsControllers.readAnuncio((anuncio:Anuncio[])=>{
    anuncios.value = anuncio
  })

  filtrarPorCategoria(null)
};
  definePage({
    meta:{
      layout: 'DefaultLayout'
    }
  })


  let produtosExibir = ref<Produto[]>()

  const categoriaSelecionada = ref<string | null>(null);
  const produtos = ref<any>()
  const categorias = ref<CategoryProducts[]>()
  const searchTerm = ref(''); // Termo de pesquisa

  watch(produtos, (val:any) =>{
    produtosExibir.value = val
  })

  function filtrarPorPesquisa() {
    const termo = searchTerm.value.toLowerCase();
    produtosExibir.value = produtos.value.filter((produto:Produto) =>
       produto.nome.toLowerCase().includes(termo)
  );
}
  async function filtrarPorCategoria(categoriaId: string | null) {
  categoriaSelecionada.value = categoriaId;
  if (!produtos.value) return;

  const produtosComDollar = await Promise.all(
    produtos.value.map(async (prod:any) => {
      const valorDollar = await cotacaoDollarService?.converterBrlUSD(prod.valor);
      return {
        ...prod,
        valorDollar: Number(valorDollar?.toFixed(2)) || 0, // Garantia de número válido
      };
    })
  );

  produtosExibir.value = categoriaId
    ? produtosComDollar.filter((produto:any) => produto.categoria_id === categoriaId)
    : produtosComDollar;

}
  onUnmounted(() => {
    productsControllers.stopListeningProducts('lerProdutos')
    productsControllers.stopListeningCategory('cadastroCategorias')
  });

  initialize()
  
</script>

