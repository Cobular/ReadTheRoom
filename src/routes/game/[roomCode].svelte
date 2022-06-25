<script lang="ts">
  import { page } from "$app/stores";
  import authStore from "$lib/stores/authStore";
</script>

{$page.params.roomCode}
{$authStore.user?.displayName}
