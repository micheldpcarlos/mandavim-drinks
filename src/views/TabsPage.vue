<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="ranking" href="/tabs/ranking">
          <ion-icon aria-hidden="true" :icon="trophy" />
          <ion-label>Ranking</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="timeline" href="/tabs/timeline">
          <ion-icon aria-hidden="true" :icon="albums" />
          <ion-label>Timeline</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
import { home, trophy, albums } from "ionicons/icons";
</script>
