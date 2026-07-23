export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos");
  }

  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const dados = await response.json();

  if (dados.erro) {
    throw new Error("CEP não encontrado");
  }

  return {
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    estado: dados.uf,
  };
}