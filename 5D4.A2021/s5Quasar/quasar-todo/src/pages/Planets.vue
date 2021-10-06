<template>
    <div class="q-pa-md row justify-center q-gutter-md 
                q-hoverable
                cursor-pointer">
            <q-card bordered class="col-2"
                    v-for="planet in planets"
                    :key="planet.href"
                    v-ripple
                    >
                <router-link :to="{ name:'detailPlanet', query:{planet: planet.href}}" style="text-decoration:none; color:inherit">
                    <q-card-section>
                        <q-img :src="planet.icon" spinner-color="blue"></q-img>
                        <h6 class='text-center'>{{planet.name}}</h6>
                    </q-card-section>
                </router-link>
            </q-card>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { api } from 'boot/axios.js';

const BASE_URL = 'https://api.andromia.science';

export default defineComponent({
    setup() {
        const planets = ref([]);

        onMounted(async () => {
            const response = await api.get(`${BASE_URL}/planets`);
            if(response.status === 200) {
                planets.value = response.data
            }            
        });

        return {
            planets
        }
    }
})
</script>

<style>
   
</style>