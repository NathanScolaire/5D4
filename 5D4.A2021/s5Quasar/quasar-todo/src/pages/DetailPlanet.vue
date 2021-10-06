<template>
  <div v-if="planet">
      <p>{{ planet.name }}</p>
  </div>
  <div v-else>
      <q-spinner/>
  </div>
</template>

<script>

import { api } from 'boot/axios';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    setup() {
        const planet = ref();
        const route = useRoute();

        onMounted(async () => {
            const response = await api.get(route.query.planet);
            if(response.status === 200)
            {
                planet.value = response.data;
            }
        });

        return {
            planet
        }
    }
})

</script>

<style>

</style>