import {
    checkpointRepo,
    corridaRepo,
    podeExcluirCheckpoint
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
  
  const select =
    document.getElementById(
      'corrida'
    );
  
  
  function corridas() {
  
    select.innerHTML =
      '<option value="">Selecione...</option>' +
  
      corridaRepo
        .listar()
        .map(
          x =>
            `<option value="${x.id}">
              ${escapeHtml(x.nome)}
            </option>`
        )
        .join('');
  
  }
  
  
  function limpar() {
  
    form.reset();
  
    document.getElementById(
      'id'
    ).value = '';
  
  }
  
  
  function render() {
  
    corridas();
  
    lista.innerHTML = '';
  
    const rs =
      corridaRepo.listar();
  
    const itens =
      checkpointRepo.listar();
  
  
    if (!itens.length) {
  
      lista.innerHTML =
        '<tr>' +
        '<td colspan="6" class="empty">' +
        'Nenhum checkpoint cadastrado.' +
        '</td>' +
        '</tr>';
  
      return;
  
    }
  
  
    itens.forEach(
      x => {
  
        const c =
          rs.find(
            r =>
              r.id ===
              x.corridaId
          );
  
  
        const tr =
          document.createElement('tr');
  
  
        tr.innerHTML = `
  
          <td>${x.id}</td>
  
          <td>
            ${escapeHtml(
              x.identificacaoLocal
            )}
          </td>
  
          <td>
            ${escapeHtml(
              x.professorResponsavel
            )}
          </td>
  
          <td>
            ${x.ordem}
          </td>
  
          <td>
            ${
              c
                ? escapeHtml(c.nome)
                : '<span class="tag">Corrida inexistente</span>'
            }
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
  
        identificacaoLocal:
          document.getElementById(
            'local'
          ).value.trim(),
  
        professorResponsavel:
          document.getElementById(
            'professor'
          ).value.trim(),
  
        ordem:
          Number(
            document.getElementById(
              'ordem'
            ).value
          ),
  
        corridaId:
          Number(
            select.value
          )
  
      };
  
  
      if (
        !corridaRepo
          .listar()
          .some(
            x =>
              x.id ===
              d.corridaId
          )
      ) {
  
        mostrarMensagem(
          'Selecione uma corrida válida.',
          'error'
        );
  
        return;
  
      }
  
  
      if (id) {
  
        checkpointRepo
          .atualizar(d);
  
      } else {
  
        checkpointRepo
          .novo(d);
  
      }
  
  
      mostrarMensagem(
        id
          ? 'Checkpoint alterado.'
          : 'Checkpoint cadastrado.'
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
          checkpointRepo
            .listar()
            .find(
              i =>
                i.id == edit
            );
  
  
        document.getElementById(
          'id'
        ).value = x.id;
  
        document.getElementById(
          'local'
        ).value =
          x.identificacaoLocal;
  
        document.getElementById(
          'professor'
        ).value =
          x.professorResponsavel;
  
        document.getElementById(
          'ordem'
        ).value =
          x.ordem;
  
        select.value =
          x.corridaId;
  
  
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
          !podeExcluirCheckpoint(
            Number(del)
          )
        ) {
  
          mostrarMensagem(
            'Não é possível excluir: este checkpoint possui passagens associadas.',
            'error'
          );
  
          return;
  
        }
  
  
        checkpointRepo.excluir(
          Number(del)
        );
  
        mostrarMensagem(
          'Checkpoint excluído.'
        );
  
        render();
  
      }
  
    }
  );
  
  
  document.getElementById(
    'cancelar'
  ).onclick = limpar;
  
  
  render();