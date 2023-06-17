<template>
  <div class="timeline ion-margin">
    <ion-select interface="action-sheet" v-model="interval">
      <ion-select-option value="todos">Todos</ion-select-option>
      <ion-select-option value="08/06">08/06</ion-select-option>
      <ion-select-option value="09/06">09/06</ion-select-option>
      <ion-select-option value="10/06">10/06</ion-select-option>
      <ion-select-option value="11/06">11/06</ion-select-option>
    </ion-select>
    <ion-card v-for="(item, index) in registrosGallery" :key="index">
      <img :src="item.image" />
      <ion-card-header>
        <ion-card-title>{{ item.bebida.nome }}</ion-card-title>
        <ion-card-subtitle>
          {{ new Date(item.timestamp.seconds * 1000).toLocaleString() }} -
          {{ item.usuario.nome }}</ion-card-subtitle
        >
      </ion-card-header>

      <ion-card-content>
        {{ item.bebida.mililitros }}ml | {{ item.bebida.teor }}%
      </ion-card-content>
    </ion-card>
    <ion-item v-if="!registrosGallery.length">
      Nenhum registro encontrado
    </ion-item>
  </div>
</template>

<script setup lang="ts">
import { registrosRef } from "@/firebase";
import { computed, ref } from "vue";
import { useCollection } from "vuefire";

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonSelect,
  IonSelectOption,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/vue";

defineProps({
  name: String,
});

const interval = ref("todos");
const registros = useCollection(registrosRef);

const formatDate = (date: Date) => {
  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1)].join(
    "/"
  );
};

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

const registrosGallery = computed(() => {
  const data = registros.data.value.filter((item) => {
    if (interval.value === "todos") return true;

    const date = new Date(item.timestamp.seconds * 1000);
    return formatDate(date) === interval.value;
  });

  data.sort((a: any, b: any) => b.timestamp - a.timestamp);

  return data;
});
</script>

<style lang="scss" scoped>
.timeline {
  display: flex;
  flex-direction: column;
}
</style>
