<template>
  <ButtonThema style="position: absolute; right: 0;" />
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="150"
      src="../../assets/LOGO.png"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >

      <form @submit.prevent="login">
        <v-alert
          color="error"
          icon="$error"
          :text="messageError"
          v-if="erro"
        ></v-alert>

        <div class="text-subtitle-1 text-medium-emphasis py-2 pb-2">E-mail</div>
        <v-text-field
          density="compact"
          placeholder="Endereço de e-mail"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
          required
        ></v-text-field>

        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
          Senha
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Esqueceu a senha?</a>
        </div>
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Insira sua senha"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="password"
          required
        ></v-text-field>

        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          :loading="loading"
          block
          type="submit"
        >
          Entrar
          <template v-slot:loader>
            <v-progress-circular color="blue-lighten-3" indeterminate></v-progress-circular>
          </template>
        </v-btn>
      </form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
    import { IAuthUserControllers } from '@/controllers/interfaces/IAuthUserControllers';
    
    import { ref, inject } from 'vue';
    import { useRouter } from 'vue-router';

    
    definePage({
      meta: { hideNavbar: true }
    })
     // Usando o Vue Router para navegação
    const router = useRouter();
    
    const email = ref('')
    const password = ref('')
    const visible = ref(false)
    const erro = ref(false)
    const loading = ref(false)
    const messageError = ref('')

    const authUserControllers = inject<IAuthUserControllers>('authUserControllers');
    
    // Função de login assíncrona
    const login = async () => {
    loading.value = true;

    // Validação simples
    if (!email.value || !password.value) {
        erro.value = true;
        messageError.value = 'E-mail ou senha não preenchidos.'
        loading.value = false;
        return;
    }

    if (!authUserControllers) {
        throw new Error('AuthUserControllers not provided');
    }

    try {
        const userLogado = await authUserControllers.entrarComEmailESenha(email.value, password.value);
        console.log(userLogado);

        // Redireciona diretamente após login
        if (userLogado) {
            router.replace('/home');
        }else{
          messageError.value = 'E-mail e/ou senha incorretos.'
          limparFormulario();
          erro.value = true;
        }
      } catch (error) {
          console.error('Erro ao tentar logar:', error);
      } finally {
          loading.value = false;
      }
  };


    const verificaUser = () =>{
      authUserControllers?.onAuthStateChanged(u => {
        if (u != null){
          router.replace('/home')
        }
      })
    }

    const limparFormulario = ()=>{
        email.value = ''
        password.value = ''
    }
    
    verificaUser()

</script>