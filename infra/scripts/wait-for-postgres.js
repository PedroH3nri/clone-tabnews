const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      console.log("🟡 Não esta aceitando conexões ainda");

      checkPostgres();

      return;
    }

    console.log("🟢 Postgres está pronto e aceitando conexões ");
  }
}

console.log("🔴 Aguardando Postgres aceitar conexões ");
checkPostgres();
