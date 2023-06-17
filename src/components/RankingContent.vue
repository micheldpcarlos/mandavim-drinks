<template>
  <div class="ranking ion-margin">
    <ion-select interface="action-sheet" v-model="interval">
      <ion-select-option value="todos">Todos</ion-select-option>
      <ion-select-option value="08/06">08/06</ion-select-option>
      <ion-select-option value="09/06">09/06</ion-select-option>
      <ion-select-option value="10/06">10/06</ion-select-option>
      <ion-select-option value="11/06">11/06</ion-select-option>
    </ion-select>
    <ion-list>
      <ion-list-header>
        <ion-label>Consumo de Álcool</ion-label>
      </ion-list-header>
      <ion-item v-for="(item, index) in alcoholRank" :key="item.nome">
        <ion-label
          >{{ index + 1 }} - {{ item.nome }} -
          {{
            item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })
          }}ml</ion-label
        >
        <span v-if="item.medal">{{ item.medal }}</span>
      </ion-item>
      <ion-item v-if="!alcoholRank.length">
        Nenhum registro encontrado
      </ion-item>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Consumo em Mililitros</ion-label>
      </ion-list-header>
      <ion-item v-for="(item, index) in mililitrosRank" :key="item.nome">
        <ion-label
          >{{ index + 1 }} - {{ item.nome }} -
          {{
            item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })
          }}ml</ion-label
        >
        <span v-if="item.medal">{{ item.medal }}</span>
      </ion-item>
      <ion-item v-if="!mililitrosRank.length">
        Nenhum registro encontrado
      </ion-item>
    </ion-list>

    <ion-list>
      <ion-list-header>
        <ion-label>Quantidade de Bebidas</ion-label>
      </ion-list-header>
      <ion-item v-for="(item, index) in vezesRank" :key="item.nome">
        <ion-label
          >{{ index + 1 }} - {{ item.nome }} -
          {{
            item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })
          }}</ion-label
        >
        <span v-if="item.medal">{{ item.medal }}</span>
      </ion-item>
      <ion-item v-if="!vezesRank.length"> Nenhum registro encontrado </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { registrosRef, usuariosRef } from "@/firebase";
import { onSnapshot } from "firebase/firestore";
import { computed, ref } from "vue";
import { useCollection } from "vuefire";

import {
  IonItem,
  IonList,
  IonLabel,
  IonListHeader,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

defineProps({
  name: String,
});

const registros = useCollection(registrosRef);

const interval = ref("todos");

const formatDate = (date: Date) => {
  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1)].join(
    "/"
  );
};

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

const alcoholRank = computed(() => {
  const data = registros.data.value
    .filter((item) => {
      if (interval.value === "todos") return true;

      const date = new Date(item.timestamp.seconds * 1000);
      return formatDate(date) === interval.value;
    })
    .reduce((accumulator, currentValue) => {
      const nome = currentValue.usuario.nome;
      const itemInAccIndex = accumulator.findIndex(
        (item: any) => item.nome === nome
      );

      if (itemInAccIndex !== -1) {
        accumulator[itemInAccIndex].total =
          accumulator[itemInAccIndex].total +
          (currentValue.bebida.teor / 100) * currentValue.bebida.mililitros;
      } else {
        accumulator.push({
          nome,
          total:
            (currentValue.bebida.teor / 100) * currentValue.bebida.mililitros,
        });
      }

      return accumulator;
    }, [])
    .sort((a: any, b: any) => b.total - a.total);

  if (data[0]) data[0].medal = "🥇";
  if (data[1]) data[1].medal = "🥈";
  if (data[2]) data[2].medal = "🥉";

  return data;
});

const mililitrosRank = computed(() => {
  const data = registros.data.value
    .filter((item) => {
      if (interval.value === "todos") return true;

      const date = new Date(item.timestamp.seconds * 1000);
      return formatDate(date) === interval.value;
    })
    .reduce((accumulator, currentValue) => {
      const nome = currentValue.usuario.nome;
      const itemInAccIndex = accumulator.findIndex(
        (item: any) => item.nome === nome
      );

      if (itemInAccIndex !== -1) {
        accumulator[itemInAccIndex].total =
          accumulator[itemInAccIndex].total + currentValue.bebida.mililitros;
      } else {
        accumulator.push({
          nome,
          total: currentValue.bebida.mililitros,
        });
      }

      return accumulator;
    }, [])
    .sort((a: any, b: any) => b.total - a.total);

  if (data[0]) data[0].medal = "🥇";
  if (data[1]) data[1].medal = "🥈";
  if (data[2]) data[2].medal = "🥉";

  return data;
});

const vezesRank = computed(() => {
  const data = registros.data.value
    .filter((item) => {
      if (interval.value === "todos") return true;

      const date = new Date(item.timestamp.seconds * 1000);
      return formatDate(date) === interval.value;
    })
    .reduce((accumulator, currentValue) => {
      const nome = currentValue.usuario.nome;
      const itemInAccIndex = accumulator.findIndex(
        (item: any) => item.nome === nome
      );

      if (itemInAccIndex !== -1) {
        accumulator[itemInAccIndex].total =
          accumulator[itemInAccIndex].total + 1;
      } else {
        accumulator.push({
          nome,
          total: 1,
        });
      }

      return accumulator;
    }, [])
    .sort((a: any, b: any) => b.total - a.total);

  if (data[0]) data[0].medal = "🥇";
  if (data[1]) data[1].medal = "🥈";
  if (data[2]) data[2].medal = "🥉";

  return data;
});
</script>

<style lang="scss" scoped>
.ranking {
  display: flex;
  flex-direction: column;
}
</style>
