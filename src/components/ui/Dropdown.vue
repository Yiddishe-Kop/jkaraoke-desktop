<template>
  <button type="button" @click="show = true" class="rounded-full">
    <slot />
    <portal v-if="show" to="dropdown">
      <div>
        <div style="z-index: 99998;" class="fixed inset-0 opacity-25 bg-purple-1000" @click="show = false" />
        <div ref="dropdown" style="position: absolute; z-index: 99999;" @click.stop="show = autoClose ? false : true">
          <slot name="dropdown" />
        </div>
      </div>
    </portal>
  </button>
</template>

<script>
import Popper from 'popper.js';

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom-end',
    },
    boundary: {
      type: String,
      default: 'scrollParent',
    },
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  watch: {
    show(show) {
      if (show) {
        this.$nextTick(() => {
          this.popper = new Popper(this.$el, this.$refs.dropdown, {
            placement: this.placement,
            modifiers: {
              preventOverflow: { boundariesElement: this.boundary },
            },
          });
        });
      } else if (this.popper) {
        setTimeout(() => this.popper.destroy(), 100);
      }
    },
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        this.show = false;
      }
    });
  },
};
</script>
