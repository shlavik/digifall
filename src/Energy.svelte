<script>
  import { energy, rColor } from "./stores.js";
  import { getBufferDiff } from "./utils.js";

  let leftBarFlex, rightBarFlex, rightValueLeft;

  const updateRColor = () => {
    if ($energy.value > 100) {
      rColor.set(`hsl(${Math.floor(360 * Math.random())}, 100%, 50%)`);
      requestAnimationFrame(updateRColor);
    } else {
      rColor.set("white");
    }
  };

  energy.subscribe(({ buffer, value }) => {
    if ($rColor === "white") updateRColor();
    requestAnimationFrame(() => {
      leftBarFlex = (value > 100 ? 200 - value : value) / 100;
      rightBarFlex = value > 100 ? (value - 100) / 100 : 0;
      rightValueLeft = (() => {
        if (value > 119) return 0;
        return (value > 100 ? value - 120 : -20) / 100;
      })();
      if (buffer !== 0) {
        const diff = getBufferDiff(buffer);
        energy.set({
          buffer: buffer - diff,
          value: value + diff,
        });
      }
    });
  });
</script>

<style>
  .energy {
    background-color: var(--color-dark);
    box-shadow: var(--shadow-inset-1);
    display: flex;
    font-size: 7rem;
    position: relative;
    width: 100%;
  }
  .left-bar,
  .right-bar {
    box-shadow: var(--shadow-1);
    padding: 1rem 0;
    overflow: hidden;
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
  }
</style>

<div class="energy">
  <div class="left-bar" style={`flex: ${leftBarFlex}`}>
    <span
      class="left-value"
      style={`position: ${$energy.value > 100 ? 'absolute' : 'relative'}`}>
      {$energy.value}
    </span>
  </div>
  <div
    class="right-bar"
    style={`background-color: ${$energy.value > 100 ? $rColor : 'var(--color-dark)'}; flex: ${rightBarFlex}`}>
    <span
      class="right-value"
      style={`left: calc(${rightValueLeft} * 128rem); position: ${$energy.value > 100 ? 'relative' : 'absolute'}`}>
      {$energy.value}
    </span>
  </div>
</div>
