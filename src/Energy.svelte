<script>
  import { energy, rColor } from "./stores.js";

  let leftBarFlex, rightBarFlex, rightValueLeft;

  const updateRColor = () => {
    if ($energy > 100) {
      rColor.set(`hsl(${Math.floor(360 * Math.random())}, 100%, 50%)`);
      requestAnimationFrame(updateRColor);
    }
  };

  energy.subscribe(energy => {
    updateRColor();
    leftBarFlex = (energy > 100 ? 200 - energy : energy) / 100;
    rightBarFlex = energy > 100 ? (energy - 100) / 100 : 0;
    rightValueLeft = (() => {
      if (energy > 119) return 0;
      return (energy > 100 ? energy - 120 : -20) / 100;
    })();
  });
</script>

<style>
  .energy {
    background-color: var(--color-dark);
    box-shadow: var(--shadow-inset-1);
    display: flex;
    font-size: var(--pixel-7);
    position: relative;
    width: 100%;
  }
  .left-bar,
  .right-bar {
    box-shadow: var(--shadow-1);
    padding: var(--pixel) 0;
    overflow: hidden;
    transition: flex 200ms ease-in-out;
  }
  .left-bar {
    background-color: white;
    text-align: right;
  }
  .right-bar {
    z-index: 1;
  }
  .left-value {
    color: var(--color-dark);
    right: 0;
  }
  .right-value {
    color: white;
    transition: left 200ms ease-in-out;
  }
</style>

<div class="energy">
  <div class="left-bar" style={`flex: ${leftBarFlex}`}>
    <span
      class="left-value"
      style={`position: ${$energy > 100 ? 'absolute' : 'relative'}`}>
      {$energy}
    </span>
  </div>
  <div
    class="right-bar"
    style={`background-color: ${$energy > 100 ? $rColor : 'var(--color-dark)'}; flex: ${rightBarFlex}`}>
    <span
      class="right-value"
      style={`left: calc(${rightValueLeft} * var(--pixel-board)); position: ${$energy > 100 ? 'relative' : 'absolute'}`}>
      {$energy}
    </span>
  </div>
</div>
