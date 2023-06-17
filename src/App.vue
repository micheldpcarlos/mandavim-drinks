<script setup lang="ts">
import { bebidasRef, usuariosRef } from "@/firebase";
import { useCollection } from "vuefire";
import { onSnapshot } from "firebase/firestore";
import { IonApp, IonRouterOutlet, IonLoading } from "@ionic/vue";
import { computed, provide, ref } from "vue";

const isLoadingUsuarios = ref(true);
onSnapshot(usuariosRef, () => {
  isLoadingUsuarios.value = false;
});

const usuarios = useCollection(usuariosRef);
provide("usuarios", usuarios);

const isLoadingBebidas = ref(true);
onSnapshot(usuariosRef, () => {
  isLoadingBebidas.value = false;
});

const bebidas = useCollection(bebidasRef);
provide("bebidas", bebidas);

const isLoadingBase = computed(
  () => isLoadingUsuarios.value || isLoadingBebidas.value
);
</script>

<template>
  <ion-app>
    <ion-router-outlet />
    <ion-loading
      :is-open="isLoadingBase"
      message="Carregando Dados..."
      translucent
    >
    </ion-loading>
  </ion-app>
</template>
