<template>
  <Carousel :carousel="carousel" :anuncios="anuncios" />

  <main>
    <MenuCategorias :categorias="categorias"  :filtrarPorCategoria="filtrarPorCategoria" :categoriaSelecionada="categoriaSelecionada" />

    <ListagemProdutos :produtosExibir="produtosExibir" />

  </main>
</template>

<script setup lang="ts">
import Carousel from '../components/Carousel.vue';
import MenuCategorias from '../components/MenuCategorias.vue';
import ListagemProdutos from '../components/ListagemProdutos.vue';
import { ref,inject,watch,onUnmounted } from 'vue';
import { IProductsControllers } from '@/controllers/interfaces/IProductsControllers';
import { CategoryProducts } from '@/models/entities/CategoryProducts';
import { Products } from '@/models/entities/Products';
import { ICotacaoDollar } from '@/models/services/ICotacaoDollar';

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

    // Métodos
const initialize = async () => {
  await productsControllers.lerTodasCategorias('cadastroCategorias', (categories:CategoryProducts[]) => {
        categorias.value = categories; // Atualiza automaticamente o array de categorias
    });

  await productsControllers.getAllProducts('lerProdutos', (products:Products[])=>{
    produtos.value = products
  })
  filtrarPorCategoria(null)
};
  definePage({
    meta:{
      layout: 'DefaultLayout'
    }
  })

  const anuncios = ref([
    {
      img:'https://firebasestorage.googleapis.com/v0/b/projetocontas-9f7da.appspot.com/o/anuncieaqui.jpg?alt=media&token=1f2b408f-3f3a-418a-8b06-448029ae3dce'
    }
  ])
  const carousel = ref([
    {
      imgDesktop: 'https://firebasestorage.googleapis.com/v0/b/projetocontas-9f7da.appspot.com/o/banner.jpg?alt=media&token=f028ef8e-46de-4ede-a78a-810a19ac3d49',
      imgMobile: 'https://firebasestorage.googleapis.com/v0/b/projetocontas-9f7da.appspot.com/o/bannermobile.jpg?alt=media&token=73476d25-f119-40ac-8aa8-23e0f7332aa0'
    },
    {
      imgDesktop: 'https://firebasestorage.googleapis.com/v0/b/projetocontas-9f7da.appspot.com/o/banner.jpg?alt=media&token=f028ef8e-46de-4ede-a78a-810a19ac3d49',
      imgMobile: 'https://firebasestorage.googleapis.com/v0/b/projetocontas-9f7da.appspot.com/o/bannermobile.jpg?alt=media&token=73476d25-f119-40ac-8aa8-23e0f7332aa0'
    },
    // Adicione mais itens conforme necessário
  ]);


  let produtosExibir = ref<Produto[]>()

  const categoriaSelecionada = ref<string | null>(null);
  const produtos = ref<any[]>()
  const categorias = ref<CategoryProducts[]>()

  watch(produtos, (val) =>{
    produtosExibir.value = val
  })
  async function filtrarPorCategoria(categoriaId: string | null) {
  categoriaSelecionada.value = categoriaId;
  if (!produtos.value) return;

  const produtosComDollar = await Promise.all(
    produtos.value.map(async (prod) => {
      const valorDollar = await cotacaoDollarService?.converterBrlUSD(prod.valor);
      return {
        ...prod,
        valorDollar: Number(valorDollar?.toFixed(2)) || 0, // Garantia de número válido
      };
    })
  );

  produtosExibir.value = categoriaId
    ? produtosComDollar.filter((produto) => produto.categoria_id === categoriaId)
    : produtosComDollar;

  console.log("Produtos com Dollar:", produtosExibir.value);
}
  onUnmounted(() => {
    productsControllers.stopListeningProducts('lerProdutos')
    productsControllers.stopListeningCategory('cadastroCategorias')
  });
  initialize()
  
</script>

