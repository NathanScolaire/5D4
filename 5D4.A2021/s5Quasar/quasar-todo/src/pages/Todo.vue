<template>
  <q-page class='bg-grey-3 column'>
      <div class="row q-pa-sm bg-primary">
          <q-input
          v-model="newTask"
          @keyup.enter="addTask"
          square
          filled
          bg-color="white"
          dense
          placeholder="Ajouter une tâche"
          class='col'
          >
          <template v-slot:append>
              <q-btn
                @click="addTask"
                round
                dense
                flat
                icon="add">
              </q-btn>
          </template>
          </q-input>
      </div>
      <q-list class='bg-white' separator bordered>
          <q-item v-for="(task, index) in tasks"
                    :key="task.title"
                    clickable
                    @click="task.isDone = !task.isDone"
                    :class="{'done bg-blue-1':task.isDone}"
                    v-ripple>
                <q-item-section avatar>
                    <q-checkbox
                        v-model="task.isDone">
                    </q-checkbox>
                </q-item-section>
              <q-item-section>
                  <q-item-label>
                      {{task.title}}
                  </q-item-label>
              </q-item-section>
              <q-item-section
                v-if="task.isDone"
                side>
                <q-btn
                    @click.stop="deleteTask(index)"
                    flat
                    round
                    dense
                    color="primary"
                    icon="delete">
                </q-btn>
              </q-item-section>
          </q-item>
      </q-list>
      <p></p>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue'
export default defineComponent({

    setup() {
        const $q = useQuasar()
        const newTask = ref('');
        const tasks = ref([]);

        return {
            newTask,
            tasks,
            addTask() {
                tasks.value.push({title:newTask.value, isDone:false})
                newTask.value = ''
            },
            deleteTask(index) {
                $q.dialog({
                    title:'Confirmation',
                    message:'Êtes-vous certain de vouloir supprimer ?',
                    cancel: true,
                    persistent:true
                }).onOk(() => {
                    tasks.value.splice(index,1)
                    $q.notify('task deleted')
                })
            }
        }
    }
})
</script>

<style lang="scss">
    .done {
        .q-item__label {
            text-decoration: line-through;
            color:#bbb;
        }
    }
</style>