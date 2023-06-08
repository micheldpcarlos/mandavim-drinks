<template>
  <ion-page :fullscreen="true">
    <ion-header>
      <ion-toolbar>
        <ion-title>Timeline</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Timeline</ion-title>
        </ion-toolbar>
      </ion-header>

      <TimelineContent />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import TimelineContent from "@/components/TimelineContent.vue";
</script>
