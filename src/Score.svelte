<script>
  import { score } from "./stores.js";
</script>

<style>
  .score {
    color: white;
    flex-basis: var(--pixel-14);
    font-size: var(--pixel-14);
    line-height: 1;
    margin-right: var(--pixel-4);
    text-align: right;
  }
</style>

<span class="score">{$score}</span>
