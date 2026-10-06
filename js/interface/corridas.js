import {
    corridaRepo,
    podeExcluirCorrida
  } from '../dados/repositorio.js';
  
  import {
    mostrarMensagem,
    confirmarExclusao,
    escapeHtml
  } from './ui.js';
  
  
  const form =
    document.getElementById('form');
  
  const lista =
    document.getElementById('lista');
  
  
  function limpar() {
  
    form.reset();
  
    document.getElementById(
      'id'
    ).value = '';
  
  }
  
  
  function render() {
  
    lista.innerHTML = '';
  
    const itens =
      corridaRepo.listar();
  
  
    if (!itens.length) {
  
      lista.innerHTML =
        '<tr>' +
        '<td colspan="5" class="empty">' +
        'Nenhuma corrida cadastrada.' +
        '</td>' +
        '</tr>';
  
      return;
  
    }
  
  
    itens.forEach(
      x => {
  
        const tr =
          document.createElement('tr');
  
        tr.innerHTML = `
          <td>${x.id}</td>
  
          <td>
            ${escapeHtml(x.nome)}
          </td>
  
          <td>
            ${escapeHtml(x.descricao)}
          </td>
  
          <td>
            ${x.data}
          </td>
  
          <td>
  
            <div class="actions">
  
              <button
                data-editar="${x.id}">
                Editar
              </button>
  
              <button
                class="danger"
                data-excluir="${x.id}">
                Excluir
              </button>
  
            </div>
  
          </td>
        `;
  
        lista.appendChild(tr);
  
      }
    );
  
  }
  
  
  form.addEventListener(
    'submit',
    e => {
  
      e.preventDefault();
  
  
      const id =
        Number(
          document.getElementById(
            'id'
          ).value
        );
  
  
      const x = {
  
        id,
  
        nome:
          document.getElementById(
            'nome'
          ).value.trim(),
  
        descricao:
          document.getElementById(
            'descricao'
          ).value.trim(),
  
        data:
          document.getElementById(
            'data'
          ).value
  
      };
  
  
      if (id) {
  
        corridaRepo.atualizar(x);
  
        mostrarMensagem(
          'Corrida alterada.'
        );
  
      } else {
  
        corridaRepo.novo(x);
  
        mostrarMensagem(
          'Corrida cadastrada.'
        );
  
      }
  
  
      limpar();
  
      render();
  
    }
  );
  
  
  lista.addEventListener(
    'click',
    e => {
  
      const edit =
        e.target.dataset.editar;
  
      const del =
        e.target.dataset.excluir;
  
  
      if (edit) {
  
        const x =
          corridaRepo
            .listar()
            .find(
              i =>
                i.id == edit
            );
  
  
        document.getElementById(
          'id'
        ).value = x.id;
  
        document.getElementById(
          'nome'
        ).value = x.nome;
  
        document.getElementById(
          'descricao'
        ).value = x.descricao;
  
        document.getElementById(
          'data'
        ).value = x.data;
  
  
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
  
      }
  
  
      if (
        del &&
        confirmarExclusao()
      ) {
  
        if (
          !podeExcluirCorrida(
            Number(del)
          )
        ) {
  
          mostrarMensagem(
            'Não é possível excluir: a corrida possui checkpoints ou passagens associados.',
            'error'
          );
  
          return;
  
        }
  
  
        corridaRepo.excluir(
          Number(del)
        );
  
        mostrarMensagem(
          'Corrida excluída.'
        );
  
        render();
  
      }
  
    }
  );
  
  
  document.getElementById(
    'cancelar'
  ).onclick = limpar;
  
  
  render();