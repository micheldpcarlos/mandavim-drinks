<script setup lang="ts">
import { beer } from "ionicons/icons";
import { computed, inject, ref } from "vue";

import {
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
  IonList,
  toastController,
  IonLoading,
  IonInput,
  IonLabel,
  alertController,
} from "@ionic/vue";
import { _RefFirestore, useFirestore } from "vuefire";
import {
  DocumentData,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const usuarioSelecionado = ref();
const bebidaSelecionada = ref();

const canConfirm = computed(() => {
  if (isAddingCustomDrink.value) {
    return (
      usuarioSelecionado.value &&
      outroMililitro.value &&
      outroNome.value &&
      outroTeor.value
    );
  }
  return usuarioSelecionado.value && bebidaSelecionada.value;
});

const getCurrentDate = (): string => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const secs = now.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}-${hours}-${minutes}-${secs}`;
};

const storage = getStorage();

const uploadPicture = async () => {
  const pictureRef = storageRef(
    storage,
    getCurrentDate() + "_" + imageFile.value.name
  );
  await uploadBytes(pictureRef, imageFile.value);
  const imageUrl = await getDownloadURL(pictureRef);

  return imageUrl;
};

const onCancelRegister = () => {
  isModalOpen.value = false;
};

const isSavingRegister = ref(false);

const db = useFirestore();
const onConfirmRegister = async () => {
  try {
    isSavingRegister.value = true;
    // upload the image to file server
    const imageUrl = await uploadPicture();

    let bebida: any;
    if (bebidaSelecionada.value !== "outro") {
      bebida = {
        ...bebidas?.value.find(
          (bebida) => bebida.id === bebidaSelecionada.value
        ),
      };
    } else {
      bebida = {
        nome: outroNome.value,
        teor: Number(outroTeor.value.replace(",", ".")),
        mililitros: Number(outroMililitro.value),
      };
    }

    const usuario = {
      id: usuarioSelecionado.value,
      ...usuarios?.value.find(
        (usuario) => usuario.id === usuarioSelecionado.value
      ),
    };

    const registro = {
      usuario,
      bebida,
      image: imageUrl,
      timestamp: Timestamp.now(),
    };

    await addDoc(collection(db, "registros"), registro);

    presentToast("✅ Registro salvo com sucesso!");
  } catch (error) {
    console.log(error);
    presentToast("❌ Erro ao salvar registro!");
  }

  isSavingRegister.value = false;
  usuarioSelecionado.value = null;
  bebidaSelecionada.value = null;
  outroMililitro.value = null;
  outroMililitro.value = null;
  outroTeor.value = null;
  isModalOpen.value = false;
};

const usuarios = inject<_RefFirestore<DocumentData[]>>("usuarios");
const bebidas = inject<_RefFirestore<DocumentData[]>>("bebidas");

defineProps({
  name: String,
});

const fileInput = ref<HTMLInputElement>();
const modal = ref();
const isModalOpen = ref(false);
const imageFile = ref();
const imageData = ref();

const onAddRegister = async () => {
  const alert = await alertController.create({
    header: "Até a próxima!",
    message: "Registros serão habilitados apenas no próximo role",
    buttons: ["OK"],
  });

  await alert.present();
  return;
  // fileInput.value?.click();
};

const onPictureSelected = (event: Event) => {
  // only start if file selected
  if (fileInput.value?.files?.[0]) {
    imageFile.value = fileInput.value.files?.[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      // store image data from reader
      imageData.value = event.target?.result;
      // open modal
      isModalOpen.value = true;
      // clear input element value
      if (fileInput.value) {
        fileInput.value.value = "";
      }
    };
    reader.readAsDataURL(imageFile.value);
  }
};

const presentToast = async (message: string) => {
  const toast = await toastController.create({
    message: message,
    duration: 2000,
    position: "top",
  });

  await toast.present();
};

const isAddingCustomDrink = computed(() => bebidaSelecionada.value === "outro");

const outroNome = ref();
const outroTeor = ref();
const outroMililitro = ref();
</script>

<template>
  <div class="home">
    <ion-button class="add-btn" @click="onAddRegister">
      <ion-icon aria-hidden="true" :icon="beer" class="ion-margin-end" />
      REGISTRAR BEBIDA
    </ion-button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="onPictureSelected"
    />

    <ion-modal ref="modal" :is-open="isModalOpen" class="modal">
      <ion-loading
        :is-open="isSavingRegister"
        message="Salvando registro..."
        translucent
      >
      </ion-loading>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="onCancelRegister()">Cancelar</ion-button>
          </ion-buttons>
          <ion-title>Registrar</ion-title>
          <ion-buttons slot="end">
            <ion-button
              :strong="true"
              @click="onConfirmRegister()"
              :disabled="!canConfirm"
              >Confirmar</ion-button
            >
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="img-wrapper">
          <img :src="imageData" alt="Algum safado se embriagando" />
        </div>
        <ion-list>
          <ion-item>
            <ion-select
              label="Pessoa"
              interface="action-sheet"
              v-model="usuarioSelecionado"
            >
              <ion-select-option
                v-for="usuario in usuarios"
                :key="usuario.id"
                :value="usuario.id"
                >{{ usuario.nome }}</ion-select-option
              >
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-select
              label="Bebida"
              interface="action-sheet"
              v-model="bebidaSelecionada"
            >
              <ion-select-option
                v-for="bebida in bebidas"
                :key="bebida.id"
                :value="bebida.id"
                >{{ bebida.nome }} -
                {{ bebida.mililitros }}ml</ion-select-option
              >
              <ion-select-option value="outro"
                >Outro (descrever)</ion-select-option
              >
            </ion-select>
          </ion-item>

          <template v-if="isAddingCustomDrink">
            <ion-item>
              <ion-input label="Nome" v-model="outroNome" />
            </ion-item>
            <ion-item>
              <ion-input
                label="Teor Alcoolico"
                type="number"
                v-model="outroTeor"
              />
            </ion-item>
            <ion-item>
              <ion-input
                label="Quantidade (ml)"
                type="number"
                v-model="outroMililitro"
              />
            </ion-item>
          </template>
        </ion-list>

        <div v-if="isAddingCustomDrink" class="bottom-space" />
      </ion-content>
    </ion-modal>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  background-image: url("background.jpg");
  background-color: #fcba2e;
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding-bottom: 2vh;

  .file-input {
    display: none;
  }

  .add-btn {
    width: 100%;
  }
}

.modal {
  .img-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
    img {
      max-height: 60vh;
    }
  }

  .bottom-space {
    height: 50vh;
  }
}
</style>
