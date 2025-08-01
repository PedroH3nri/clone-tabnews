import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);

  return await response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1> Status </h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let database = [];
  let updateAtFormat = "Carregando...";

  if ((!isLoading, data)) {
    database = data.dependencies.database;
    updateAtFormat = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <hr></hr>

      <div>
        <p>Banco de dados:</p>
        <p>
          Conexões: {database.active_connections ?? "Carregando..."} /{" "}
          {database.max_connections ?? "Carregando..."} - Em Idle:{" "}
          {database.idle_connections ?? "Carregando..."}
        </p>
        <p>Versão: {database.version ?? "Carregando..."}</p>
      </div>

      <hr></hr>

      <p>Última atualização: {updateAtFormat}</p>
    </div>
  );
}
