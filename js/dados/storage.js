const PREFIX = 'trekking_v3_';


export function carregar(
  chave,
  padrao = []
) {

  const bruto =
    localStorage.getItem(
      PREFIX + chave
    );

  if (!bruto) {
    return padrao;
  }

  try {

    return JSON.parse(bruto);

  } catch {

    localStorage.removeItem(
      PREFIX + chave
    );

    return padrao;

  }

}


export function salvar(
  chave,
  dados
) {

  localStorage.setItem(
    PREFIX + chave,
    JSON.stringify(dados)
  );

}


export function proximoId(chave) {

  const itens =
    carregar(chave);

  if (!itens.length) {
    return 1;
  }

  return (
    Math.max(
      ...itens.map(
        x => Number(x.id) || 0
      )
    ) + 1
  );

}


export function limparTudo() {

  Object.keys(localStorage)
    .filter(
      chave =>
        chave.startsWith(PREFIX)
    )
    .forEach(
      chave =>
        localStorage.removeItem(chave)
    );

}