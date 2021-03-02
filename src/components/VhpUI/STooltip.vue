<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

function findLastText(node: Node): Node {
  if (node instanceof Text) {
    return node;
  }

  for (let index = 0; index < node.childNodes.length; index++) {
    const childNode = node.childNodes[index];
    return findLastText(childNode);
  }
}

export default defineComponent({
  props: {
    spacing: { type: Number, required: false, default: 0 },
    maxWidth: { type: [Number, String], required: false },
    lines: { type: Number, required: false, default: 1 },
    target: { type: String, required: false },
    ignore: { type: String, required: false },
  },
  mounted() {
    this.loadTip();
  },
  watch: {
    text: {
      handler() {
        this.loadTip();
      },
    },
  },
  setup() {
    const text = ref('');
    const selector = ref('');
    const addTip = ref<boolean>(false);

    return { text, selector, addTip };
  },
  computed: {
    tooltip() {
      const tooltip: Element = this.$children[0].$el;
      if (
        (this.target && tooltip.localName !== this.target) ||
        (tooltip.firstElementChild &&
          tooltip.firstElementChild.localName === this.ignore)
      ) {
        return;
      }
      return tooltip;
    },
  },
  methods: {
    sendUpdate() {
      if (this.addTip === true) {
        this.$emit('set:tip', {
          selector: `#${this.selector}`,
          text: this.text,
        });
      }
    },
    loadTip() {
      if (this.tooltip && this.tooltip.childNodes.length > 0) {
        const wrapper = document.createElement('div');
        const textNode = findLastText(this.tooltip);
        const parentEl = window.getComputedStyle(this.tooltip);
        this.tooltip.replaceChild(wrapper, this.tooltip.firstChild);
        wrapper.appendChild(textNode);
        Object.assign(textNode.parentElement.style, {
          display: 'inline-block',
        });
        const childEl = window.getComputedStyle(textNode.parentElement);
        if (
          parseInt(parentEl.width) <=
          parseInt(childEl.width) + this.spacing
        ) {
          this.text = textNode.parentElement.innerText;
          this.addTip = true;

          this.selector = `tooltip_${this._uid}`;

          this.tooltip.setAttribute('id', this.selector);
          this.tooltip.addEventListener(
            'mouseover',
            this.sendUpdate.bind(this)
          );
          textNode.parentElement.classList.add('tt-text');
          Object.assign(textNode.parentElement.style, {
            display: '-webkit-box',
            '-webkit-line-clamp': this.lines,
            'word-break': this.lines > 1 ? 'break-all' : undefined,
          });
          return;
        } else if (this.addTip) {
          // telah ter convert ke tip
          // jangan trigger stop add tip
          this.addTip = false;
          return;
        }
      }
      this.addTip = false;
    },
  },
  destroyed() {
    this.tooltip?.removeEventListener('mouseover', this.sendUpdate);
  },
  render() {
    const node = this.$slots.default;
    return node[0];
  },
});
</script>
<style lang="scss">
.tt-text {
  text-overflow: ellipsis;
  overflow: hidden;
  // white-space: nowrap;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word; /* Renamed property in CSS3 draft spec */
}
</style>
