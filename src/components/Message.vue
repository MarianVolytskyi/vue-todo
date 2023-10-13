<script>
export default {
  emits: ['hide'],
  props: {
    active: Boolean,
  },
  methods: {
    hide() {
      this.$emit('hide');
    }
  }
};
</script>

<template>
  <div
    class="notification is-danger is-light has-text-weight-normal"
    :class="{
      'is hidden': !active,
    }"
  >
    <p>Error</p>
    <button type="button" class="delete" @click="hide"/>

    <div class="message is-danger">
      <slot>ERROR</slot>
    </div>
  </div>
</template>
