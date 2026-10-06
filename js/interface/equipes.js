import {
    equipeRepo,
    podeExcluirEquipe
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
      equipeRepo.listar();
  
  
    if (!itens.length) {
  
      lista.innerHTML =
        '<tr>' +
        '<td colspan="5" class="empty">' +
        'Nenhuma equipe cadastrada.' +
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
            ${x.numero}
          </td>
  
          <td>
            ${escapeHtml(x.integrantes)}
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
  
  
      const d = {
  
        id,
  
        nome:
          document.getElementById(
            'nome'
          ).value.trim(),
  
        numero:
          Number(
            document.getElementById(
              'numero'
            ).value
          ),
  
        integrantes:
          document.getElementById(
            'integrantes'
          ).value.trim()
  
      };
  
  
      const duplicada =
        equipeRepo
          .listar()
          .some(
            x =>
              x.numero ===
                d.numero &&
              x.id !== id
          );
  
  
      if (duplicada) {
  
        mostrarMensagem(
          'Já existe uma equipe com esse número.',
          'error'
        );
  
        return;
  
      }
  
  
      if (id) {
  
        equipeRepo.atualizar(d);
  
      } else {
  
        equipeRepo.novo(d);
  
      }
  
  
      mostrarMensagem(
        id
          ? 'Equipe alterada.'
          : 'Equipe cadastrada.'
      );
  
  
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
          equipeRepo
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
          'numero'
        ).value = x.numero;
  
        document.getElementById(
          'integrantes'
        ).value =
          x.integrantes;
  
  
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
          !podeExcluirEquipe(
            Number(del)
          )
        ) {
  
          mostrarMensagem(
            'Não é possível excluir: esta equipe possui passagens associadas.',
            'error'
          );
  
          return;
  
        }
  
  
        equipeRepo.excluir(
          Number(del)
        );
  
        mostrarMensagem(
          'Equipe excluída.'
        );
  
        render();
  
      }
  
    }
  );
  
  
  document.getElementById(
    'cancelar'
  ).onclick = limpar;
  
  
  render();