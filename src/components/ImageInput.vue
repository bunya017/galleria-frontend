<template>
  <div class="row">
    <q-uploader
      class="col"
      ref="imageInput"
      :label="label"
      :color="color"
      :accept="accept"
      hide-upload-btn
      :multiple="multiple"
      :text-color="textColor"
      @added="updateErrorStatus"
    >
      <template v-slot:header="scope">
        <div
          class="row no-wrap items-center q-pa-sm q-gutter-xs"
          :class="{ 'negative-border': error }"
        >
          <q-btn
            v-if="scope.queuedFiles.length > 0"
            icon="clear_all" @click="scope.removeQueuedFiles"
            round
            dense
            flat
          />
          <div class="col">
            <div class="q-uploader__title" :class="{ 'text-negative': error }">
              {{ label }}
            </div>
            <div class="q-uploader__subtitle" v-if="scope.queuedFiles.length > 0">
              {{ scope.uploadSizeLabel }}
            </div>
            <div class="q-uploader__subtitle text-negative" v-if="error">
              {{ errorMessage }}
            </div>
          </div>
          <q-btn
            v-if="error"
            icon="error"
            color="negative"
            round
            dense
            flat
          />
          <q-btn v-if="scope.canAddFiles" icon="add_box" round dense flat>
            <q-uploader-add-trigger />
          </q-btn>
        </div>
      </template>
      <template v-slot:list="scope">
        <q-list separator>
          <q-item v-for="file in scope.files" :key="file.name">
            <q-item-section>
              <q-item-label class="full-width ellipsis">
                {{ file.name }}
              </q-item-label>
              <q-item-label caption>
                {{ file.__sizeLabel }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              v-if="file.__img"
              thumbnail
            >
              <img :src="file.__img.src" class="input-image-thumbnail">
            </q-item-section>
            <q-item-section side>
              <q-btn
                size="12px"
                flat
                dense
                round
                icon="delete"
                @click="scope.removeFile(file)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </q-uploader>
  </div>
</template>

<script>
export default {
  name: 'ImageInput',
  props: {
    label: String,
    color: String,
    textColor: String,
    accept: String,
    error: Boolean,
    errorMessage: String,
    multiple: Boolean
  },
  methods: {
    updateErrorStatus () {
      return this.$store.dispatch(
        'dashStore/setImageInputErrorStatusAction', true
      )
    }
  },
  computed: {
    files () {
      return this.$refs.imageInput.files
    }
  }
}
</script>

<style scoped>
.input-image-thumbnail {
  max-height: 56px;
  width: auto;
  border-radius: 5px;
}

.negative-border {
  border-bottom: 2px solid #c10015;
  margin: auto;
}
</style>
