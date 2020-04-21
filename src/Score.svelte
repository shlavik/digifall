<script>
  import { score } from "./stores.js";
</script>

<style>
  .score {
    color: white;
    font-size: var(--pixel-7);
    line-height: 1;
    margin-right: var(--pixel-4);
    text-align: right;
    width: 100%;
  }
</style>

<span class="score">{$score}</span>
