<script>
  import { score } from "./stores.js";
</script>

<style>
  .score {
    font-size: var(--pixel-7);
    line-height: 1;
    text-align: right;
  }
</style>

<span class="score">{$score}</span>
