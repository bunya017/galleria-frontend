<template>
  <div class="row">
    <q-uploader
      ref="imageInput"
      class="col"
      :label="label"
      :color="color"
      :text-color="textColor"
      :accept="accept"
      hide-upload-btn
    >
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
    accept: String
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
</style>
