<template>
    <nav class="ma-0 ma-sm-0 mb-16 mb-md-16 mb-lg-16 mb-xxl-16">
      <v-app-bar v-if="size || usuario == null" :elevation="2" extension>
        <v-app-bar-nav-icon v-if="usuario" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>
          <v-btn icon size="48" href="/">
            <img src="@/assets/LOGO.png" alt="logoInstagram" width="48">
          </v-btn>
        </v-app-bar-title>
        <template #append>
          <div v-if="!usuario">
            <v-btn size="48" href="https://www.instagram.com/criando_itens?igsh=OXhzdmltbnJwMjA2" target="_blank">
              <img src="../assets/instagran.png" alt="logoInstagram" width="34">
            </v-btn>
            <v-btn size="48" href="https://youtube.com/@criandoitens9281?si=00iiaBDKZmT0fsqt" target="_blank">
              <img src="../assets/youtube.png" alt="logoYouTube" width="34">
            </v-btn>
            <v-btn size="48" href="https://wa.me/558699700524?text=Olá%2C%20gostaria%20de%20saber%20mais%20informações!" target="_blank">
              <img src="../assets/whatsapp.png" alt="logoWhatsapp" width="34">
            </v-btn>
          </div>
          <v-spacer></v-spacer>
  
          <v-btn v-if="usuario" text @click="deslogar">
            <span>Exit</span>
            <v-icon icon="mdi-exit-to-app" right></v-icon>
          </v-btn>
          <ButtonThema />
        </template>
      </v-app-bar>
  
      <v-navigation-drawer v-if="usuario" v-model="drawer" temporary>
        <v-list flat>
          <v-list-item v-for="link in links" :key="link.text" router :to="link.route" active-class="border">
            <v-list-item-action>
              <v-icon>{{ link.icon }}</v-icon>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn class="bg-deep-purple" block v-if="usuario" text @click="deslogar">
              <v-icon icon="mdi-exit-to-app" right></v-icon>
              <span>Exit</span>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  
      <v-bottom-navigation class="hidden-md-and-up" v-if="usuario" :elevation="1" grow>
        <v-btn v-for="link in links.slice(0, 3)" :key="link.text" router :to="link.route" active-class="border" :value="link.text">
          <v-icon>{{ link.icon }}</v-icon>
          <span>{{ link.text }}</span>
        </v-btn>
        <v-btn v-if="usuario" text @click.stop="drawer = !drawer">
          <v-icon icon="mdi-menu" right></v-icon>
          <span>Mais</span>
        </v-btn>
      </v-bottom-navigation>
    </nav>
  </template>
  
  <script setup>
  import { ref, inject, onBeforeMount, watch, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDisplay } from 'vuetify'
  
  const { mobile } = useDisplay()
  
  const size = ref(!mobile.value)
  const drawer = ref(false)
  const usuario = ref(null)
  const idUser = ref(null)
  
  const links = ref([
    { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/home' },
    { icon: 'mdi-package-variant-closed-plus', text: 'Produtos', route: '/listprodutos' },
    { icon: 'mdi-shape', text: 'Categorias', route: '/categorias' },
    { icon: 'mdi-cog', text: 'Configurações', route: '/configuracoes' },
  ]);
  
  const router = useRouter()
  
  // Injetando o controlador de autenticação
  const authUserControllers = inject('authUserControllers')
  if (!authUserControllers) {
    throw new Error('authUserControllers não foi injetado corretamente')
  }
  
  // Função para deslogar
  const deslogar = () => {
    authUserControllers.deslogar()
    router.replace('/')
  }
  
  // Função para obter o id do usuário
  const getIdUser = async () => {
    idUser.value = await authUserControllers.getIdUser()
  }
  
  // Função para obter os detalhes do usuário
  const getUser = async () => {
    const id = idUser.value
    if (id != null) {
      const user = await authUserControllers.getUserId(id)
      usuario.value = user
    }
  }
  
  // Watch para atualizar o usuário quando o id mudar
  watch(idUser, async (newId) => {
    if (newId) {
      await getUser()
    }
  })
  
  // Método para observar o estado da autenticação
  const observeAuthState = () => {
    authUserControllers.onAuthStateChanged((user) => {
      usuario.value = user
    })
  }
  
  // Cancelar o listener quando o componente for desmontado
  onBeforeUnmount(() => {
    observeAuthState()
  })
  
  onBeforeMount(async () => {
    await getIdUser()
    await getUser()
    observeAuthState() // Começa a observar o estado de autenticação
  })
  </script>
  
  <style scoped>
  .v-list-item--active {
    border-left: 4px solid #0ba518 !important;
  }
  
  @media (max-width: 959px) {
    .teste {
      height: 100vh !important;
    }
  }
  </style>
  