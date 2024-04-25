<script>
  import { tick } from "svelte";
  import { fade } from "svelte/transition";

  import GameOver from "./GameOver.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import Menu from "./Menu.svelte";
  import Options from "./Options.svelte";
  import Wellcome from "./Wellcome.svelte";

  import { OVERLAYS, PHASES } from "./constants.js";
  import { overlay, phase } from "./stores.js";

  let leaderboardComponent = null;
  let menuComponent = null;
  let optionsComponent = null;
  let scoreComponent = null;
  let focusElement = null;

  export async function switchOverlay() {
    await tick();
    if (menuComponent && menuComponent.isNewGameDialog()) {
      return menuComponent.closeNewGameDialog();
    }
    $overlay =
      $overlay === null
        ? OVERLAYS.menu
        : $overlay === OVERLAYS.menu
          ? null
          : $overlay === OVERLAYS.leaderboard
            ? OVERLAYS.menu
            : $overlay === OVERLAYS.options
              ? OVERLAYS.menu
              : null;
  }

  export function moveUp() {
    shiftFocus(-1);
  }

  export function moveDown() {
    shiftFocus(1);
  }

  export function moveLeft() {
    if ($overlay === OVERLAYS.leaderboard) {
      if (!focusElement) return;
      return focusElement.classList.contains("type")
        ? focusElement.click()
        : focusElement.classList.contains("pages")
          ? leaderboardComponent.prevPage()
          : null;
    }
    if ($overlay !== OVERLAYS.options || optionsComponent.isDialogOpened())
      shiftFocus(-1);
  }

  export function moveRight() {
    if ($overlay === OVERLAYS.leaderboard) {
      if (!focusElement) return;
      return focusElement.classList.contains("type")
        ? focusElement.click()
        : focusElement.classList.contains("pages")
          ? leaderboardComponent.nextPage()
          : null;
    }
    if ($overlay !== OVERLAYS.options || optionsComponent.isDialogOpened())
      shiftFocus(-1);
  }

  export function perfomAction() {
    if (!focusElement) return;
    scoreComponent && scoreComponent.isFocused()
      ? scoreComponent.nextType()
      : focusElement.classList.contains("focus")
        ? focusElement.click()
        : null;
  }

  export function blur() {
    if (focusElement) {
      focusElement.blur();
    }
    if (
      $overlay === OVERLAYS.options ||
      $overlay === OVERLAYS.leaderboard ||
      $overlay === OVERLAYS.gameOver
    ) {
      return ($overlay = OVERLAYS.menu);
    }
    if ($overlay === OVERLAYS.menu && $phase !== PHASES.gameOver) {
      return ($overlay = null);
    }
  }

  function findElement({ node, selectors, shift = 0 } = {}) {
    if (!selectors || selectors.length < 1) return;
    const selector = selectors.map((s) => ".overlay " + s).join(", ");
    const elements = Array.from(document.querySelectorAll(selector));
    if (!node) return elements.at(shift < 0 ? shift : 0);
    if (shift === 0) return node;
    const index = elements.indexOf(node);
    if (index === -1) return elements.at(shift < 0 ? shift : 0);
    let newIndex = index + shift;
    if (newIndex < 0) newIndex = elements.length + newIndex;
    if (newIndex > elements.length - 1) newIndex = newIndex - elements.length;
    return elements[newIndex];
  }

  function focus(element) {
    if (!element) return;
    if (scoreComponent && scoreComponent.isFocused()) scoreComponent.blur();
    if (focusElement) {
      focusElement.classList.remove("focus");
      focusElement.blur();
    }
    if (element.classList.contains("score")) {
      return scoreComponent && scoreComponent.focus();
    }
    focusElement = element;
    focusElement.classList.add("focus");
    focusElement.focus();
  }

  function shiftFocus(shift) {
    const selectors = [
      "button:not(.digifall)",
      "[role='button']",
      "input:not([type='checkbox'])",
    ];
    const selector = selectors
      .map((s) => ".overlay " + s + ".focus")
      .join(", ");
    const node = document.querySelector(selector);
    const element = findElement({ node, selectors, shift });
    focus(element);
  }
</script>

{#if $overlay}
  <div class="overlay" transition:fade={{ duration: 200 }}>
    {#if $overlay === OVERLAYS.gameOver}
      <GameOver bind:scoreComponent />
    {:else if $overlay === OVERLAYS.leaderboard}
      <Leaderboard bind:this={leaderboardComponent} />
    {:else if $overlay === OVERLAYS.menu}
      <Menu bind:this={menuComponent} />
    {:else if $overlay === OVERLAYS.options}
      <Options bind:this={optionsComponent} />
    {:else if $overlay === OVERLAYS.wellcome}
      <Wellcome />
    {/if}
  </div>
{/if}
