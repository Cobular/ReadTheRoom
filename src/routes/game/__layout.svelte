<nav>
  <h3>Read The Room!</h3>

  <h5>Join Different Game</h5>
  <h5>Sign Out</h5>
</nav>

<slot />

<style lang="scss">
  nav {
    display: flex;
    flex-direction: row;

    :first-child {
      margin-right: auto
    }
  }
</style>