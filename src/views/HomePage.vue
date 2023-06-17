<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <HomeContent />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import HomeContent from "@/components/HomeContent.vue";
</script>
