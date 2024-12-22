<template>
  <v-card color="primary">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h2 text-basil">
        Configurações
      </h1>
    </v-card-title>
    <v-tabs
      v-model="tab"
      bg-color="trasparent"
      grow
    >
      <v-tab value="listBanner" @click="cancelarEdicao">Listagem Banners</v-tab>
      <v-tab value="newBanner">Novo Banner</v-tab>
      <v-tab value="listAnuncio" @click="cancelarEdicaoAnuncio">Listagem Anuncios</v-tab>
      <v-tab value="newAnuncio">Novo Anuncios</v-tab>
      
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item
        value="listBanner"
        >
          <v-container fluid>
            <v-row>
              <v-col
                v-for="banner in banners"
                :key="banner.id"
                cols="12"
                md="4"
              >
              <v-card>
                <v-carousel 
                height="263"
                :show-arrows="false"
                >
                  <v-carousel-item :src="banner.imgDesktop" cover>

                  </v-carousel-item>
                  <v-carousel-item :src="banner.imgMobile" cover>

                  </v-carousel-item>
                </v-carousel>
                
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="medium-emphasis"
                  icon="mdi-pencil"
                  size="small"
                  @click="editBanner(banner)"
                ></v-btn>

                <v-btn
                  color="medium-emphasis"
                  icon="mdi-delete"
                  @click="deleteBanner(banner)"
                  size="small"
                ></v-btn>

                <v-btn
                  color="medium-emphasis"
                  :icon="banner.ativo ? 'mdi-eye' : 'mdi-eye-off'"
                  @click="inativarBanner(banner)"
                  size="small"
                ></v-btn>
              </v-card-actions>
              </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>

        <v-tabs-window-item value="newBanner">
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="bannersDefault.nome"
                    label="Nome da Promoção"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="bannersDefault.imgDesktop"
                    label="Link Banner Desktop"
                  ></v-text-field>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="bannersDefault.imgMobile"
                    label="Link Banner Mobile"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" class="d-flex" style="gap: 6px;">
                  <v-btn v-if="!editOn" color="success" @click="addBanner" >Cadastrar</v-btn>
                  <v-btn v-else color="success" @click="saveEdicao" >Salvar</v-btn>
                  <v-btn color="error" v-if="editOn"  @click="cancelarEdicao" >Cancelar Edição</v-btn>
                </v-col>
              </v-row>
            </v-container>

          </v-form>
        </v-tabs-window-item>

        <v-tabs-window-item value="listAnuncio">
          <v-container fluid>
            <v-row>
              <v-col
                v-for="anuncio in anuncios"
                :key="anuncio.id"
                cols="12"
                md="4"
              >
              <v-card>
                <v-img 
                :src="anuncio.img"
                height="263"
                cover
                 />
                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="medium-emphasis"
                  icon="mdi-pencil"
                  size="small"
                  @click="editAnuncio(anuncio)"
                ></v-btn>

                <v-btn
                  color="medium-emphasis"
                  icon="mdi-delete"
                  size="small"
                  @click="deleteAnuncio(anuncio)"
                ></v-btn>

                <v-btn
                  color="medium-emphasis"
                  :icon="anuncio.ativo ? 'mdi-eye' : 'mdi-eye-off'"
                  @click="inativarAnuncio(anuncio)"
                  size="small"
                ></v-btn>
              </v-card-actions>
              </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item value="newAnuncio">
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="anunciosDefault.img"
                    label="Imagem Anuncio"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="anunciosDefault.link"
                    label="Link Anuncio"
                    placeholder="https://exemple.com"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-switch color="green" base-color="error" :label="!anunciosDefault.direction ? 'Esquerda' : 'Direita'" v-model="anunciosDefault.direction" inset></v-switch>
                  </v-col>
                <v-col cols="12" md="6" class="d-flex" style="gap: 6px;">
                  <v-btn v-if="!editOnAnuncio"color="success" @click="addAnuncio">Cadastrar</v-btn>
                  <v-btn v-else color="success" @click="saveEdicaoAnuncio" >Salvar</v-btn>
                  <v-btn v-if="editOnAnuncio" color="error" @click="cancelarEdicaoAnuncio">Cancelar Edição</v-btn>
                </v-col>
              </v-row>
            </v-container>

          </v-form>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
  <!-- Dialog de Exclusão -->
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Tem certeza em remover esses Banners?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
        <v-btn color="blue-darken-1" :loading="loading" variant="text" @click="deleteItemConfirm">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialogDeleteAnuncio" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Tem certeza em remover esse Anuncio?</v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDeleteAnuncio">Cancelar</v-btn>
        <v-btn color="blue-darken-1" :loading="loading" variant="text" @click="deleteItemConfirmAnuncio">OK</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
  import {ref, inject, onUnmounted,onBeforeUnmount} from 'vue'
  import { ISettingsControllers } from '@/controllers/interfaces/ISettingsControllers';
  import { Banners } from '@/models/entities/Banners';
  import { Anuncio } from '@/models/entities/Anuncio';
  const banners = ref<Banners[]>([])
  const anuncios = ref<Anuncio[]>([])
  const editOn = ref<boolean>(false)
  const editOnAnuncio = ref<boolean>(false)
  const dialogDelete = ref<boolean>(false)
  const dialogDeleteAnuncio = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const bannersDefault = ref({
    id:'',
    nome:'',
    imgDesktop:'',
    imgMobile:'',
    ativo:true
  })
  const anunciosDefault = ref({
    id:'',
    img:'',
    ativo:true,
    direction:false,
    link:''
  })
  const settingsControllers = inject<ISettingsControllers>("settings")
  if (!settingsControllers){
    throw new Error('settingsControllers not provided');
  }
  const tab = ref<string | null>(null)

  definePage({
    meta: {
      requiresAuth: true,  // Indica que a rota requer autenticação
    }
  })


  const initialize = async () =>{
    await settingsControllers.readBanner((banner:Banners[])=>{
      banners.value = banner
    })
    await settingsControllers.readAnuncio((anuncio:Anuncio[])=>{
      anuncios.value = anuncio
    })
  }

  const addBanner = async ()=>{
    await settingsControllers.createBanner(bannersDefault.value.nome,bannersDefault.value.imgDesktop,bannersDefault.value.imgMobile, bannersDefault.value.ativo)
    limparCampos()
  }


  const deleteBanner = async (banner:Banners)=>{
    bannersDefault.value = {
      id: banner.id,
      nome:banner.nome,
      imgDesktop: banner.imgDesktop,
      imgMobile: banner.imgMobile,
      ativo: banner.ativo,
    };
    dialogDelete.value = true
  }

  const closeDelete = ()=>{
    dialogDelete.value = false
    limparCampos()
  }

  const deleteItemConfirm = async ()=>{
    loading.value = true
    await settingsControllers.deleteBanner(bannersDefault.value.id)
    limparCampos()
    loading.value = false
    dialogDelete.value = false
  }

  const editBanner = (banner: Banners) => {
    // Preenche os campos do formulário com os dados do banner
    bannersDefault.value = {
      id: banner.id,
      nome:banner.nome,
      imgDesktop: banner.imgDesktop,
      imgMobile: banner.imgMobile,
      ativo: banner.ativo,
    };

    // Define a aba ativa como 'newBanner'
    editOn.value = true
    tab.value = 'newBanner';
  };

  const inativarBanner = async (banner:Banners)=>{
    bannersDefault.value = {
      id: banner.id,
      nome:banner.nome,
      imgDesktop: banner.imgDesktop,
      imgMobile: banner.imgMobile,
      ativo:!banner.ativo
    };
    await settingsControllers.editBanner(bannersDefault.value.id,bannersDefault.value.nome,bannersDefault.value.imgDesktop,bannersDefault.value.imgMobile,bannersDefault.value.ativo)

    limparCampos()
  }
  const saveEdicao = async ()=>{
    await settingsControllers.editBanner(bannersDefault.value.id,bannersDefault.value.nome,bannersDefault.value.imgDesktop,bannersDefault.value.imgMobile,bannersDefault.value.ativo)
    editOn.value = false
    limparCampos()
  }

  const cancelarEdicao = ()=>{
    editOn.value = false
    limparCampos()
  }

  const limparCampos = ()=>{
    bannersDefault.value.id = ''
    bannersDefault.value.nome=''
    bannersDefault.value.imgDesktop = ''
    bannersDefault.value.imgMobile = ''
  }

  const addAnuncio = async ()=>{
    await settingsControllers.createAnuncio(anunciosDefault.value.img, anunciosDefault.value.ativo, anunciosDefault.value.direction, anunciosDefault.value.link)
    limparCamposAnuncio()
  }


  const deleteAnuncio = async (anuncio:Anuncio)=>{
    anunciosDefault.value = {
      id: anuncio.id,
      img:anuncio.img,
      ativo: anuncio.ativo,
      direction: anuncio.direction,
      link:anuncio.link
    };
    dialogDeleteAnuncio.value = true
  }

  const closeDeleteAnuncio = ()=>{
    dialogDeleteAnuncio.value = false
    limparCamposAnuncio()
  }

  const deleteItemConfirmAnuncio = async ()=>{
    loading.value = true
    console.log(anunciosDefault.value)
    await settingsControllers.deleteAnuncio(anunciosDefault.value.id)
    limparCamposAnuncio()
    loading.value = false
    dialogDeleteAnuncio.value = false
  }

  const editAnuncio = (anuncio: Anuncio) => {
    // Preenche os campos do formulário com os dados do anuncio
    anunciosDefault.value = {
      id: anuncio.id,
      img: anuncio.img,
      ativo: anuncio.ativo,
      direction: anuncio.direction,
      link:anuncio.link
    };

    // Define a aba ativa como 'newanuncio'
    editOnAnuncio.value = true
    tab.value = 'newAnuncio';
  };

  const inativarAnuncio = async (anuncio:Anuncio)=>{
    anunciosDefault.value = {
      id: anuncio.id,
      img: anuncio.img,
      ativo:!anuncio.ativo,
      direction: anuncio.direction,
      link:anuncio.link
    };
    await settingsControllers.editAnuncio(anunciosDefault.value.id,anunciosDefault.value.img,anunciosDefault.value.ativo, anunciosDefault.value.direction, anunciosDefault.value.link)

    limparCamposAnuncio()
  }
  const saveEdicaoAnuncio = async ()=>{
    await settingsControllers.editAnuncio(anunciosDefault.value.id,anunciosDefault.value.img,anunciosDefault.value.ativo, anunciosDefault.value.direction, anunciosDefault.value.link)
    editOnAnuncio.value = false
    limparCamposAnuncio()
  }

  const cancelarEdicaoAnuncio = ()=>{
    editOnAnuncio.value = false
    limparCamposAnuncio()
  }

  const limparCamposAnuncio = ()=>{
    anunciosDefault.value.id = ''
    anunciosDefault.value.img = ''
    anunciosDefault.value.link = ''
    anunciosDefault.value.direction = false
  }
  onUnmounted(()=>{
    settingsControllers.pararEscutadorAnuncio()
    settingsControllers.pararEscutadorBanner()
  })
  onBeforeUnmount(()=>{
    settingsControllers.pararEscutadorAnuncio()
    settingsControllers.pararEscutadorBanner()
  })
  initialize()

</script>
