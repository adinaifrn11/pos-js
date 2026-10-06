import {
    passagemRepo,
    corridaRepo,
    checkpointRepo,
    equipeRepo
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
  
  const sc =
    document.getElementById('corrida');
  
  const sp =
    document.getElementById(
      'checkpoint'
    );
  
  const se =
    document.getElementById(
      'equipe'
    );
  
  
  function carregarSelects() {
  
    sc.innerHTML =
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
  
  
    se.innerHTML =
      '<option value="">Selecione...</option>' +
  
      equipeRepo
        .listar()
        .map(
          x =>
            `<option value="${x.id}">
              ${escapeHtml(x.nome)}
              (#${x.numero})
            </option>`
        )
        .join('');
  
  
    atualizarCheckpoints();
  
  }
  
  
  function atualizarCheckpoints() {
  
    const id =
      Number(sc.value);
  
  
    sp.innerHTML =
      '<option value="">Selecione...</option>' +
  
      checkpointRepo
        .listar()
        .filter(
          x =>
            x.corridaId === id
        )
        .map(
          x =>
            `<option value="${x.id}">
              ${escapeHtml(
                x.identificacaoLocal
              )}
              (ordem ${x.ordem})
            </option>`
        )
        .join('');
  
  }
  
  
  function limpar() {
  
    form.reset();
  
    document.getElementById(
      'id'
    ).value = '';
  
    carregarSelects();
  
  }
  
  
  function render() {
  
    carregarSelects();
  
    lista.innerHTML = '';
  
  
    const rs =
      corridaRepo.listar();
  
    const cs =
      checkpointRepo.listar();
  
    const es =
      equipeRepo.listar();
  
    const itens =
      passagemRepo.listar();
  
  
    if (!itens.length) {
  
      lista.innerHTML =
        '<tr>' +
        '<td colspan="6" class="empty">' +
        'Nenhuma passagem cadastrada.' +
        '</td>' +
        '</tr>';
  
      return;
  
    }
  
  
    itens.forEach(
      x => {
  
        const r =
          rs.find(
            i =>
              i.id ===
              x.corridaId
          );
  
        const c =
          cs.find(
            i =>
              i.id ===
              x.checkpointId
          );
  
        const e =
          es.find(
            i =>
              i.id ===
              x.equipeId
          );
  
  
        const tr =
          document.createElement('tr');
  
  
        tr.innerHTML = `
  
          <td>${x.id}</td>
  
          <td>
            ${
              r
                ? escapeHtml(r.nome)
                : '-'
            }
          </td>
  
          <td>
            ${
              c
                ? escapeHtml(
                    c.identificacaoLocal
                  )
                : '-'
            }
          </td>
  
          <td>
            ${
              e
                ? escapeHtml(e.nome)
                : '-'
            }
          </td>
  
          <td>
            ${new Date(
              x.dataHora
            ).toLocaleString(
              'pt-BR'
            )}
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
  
  
  sc.addEventListener(
    'change',
    atualizarCheckpoints
  );
  
  
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
  
  
      const corridaId =
        Number(sc.value);
  
      const checkpointId =
        Number(sp.value);
  
      const equipeId =
        Number(se.value);
  
  
      const cp =
        checkpointRepo
          .listar()
          .find(
            x =>
              x.id ===
              checkpointId
          );
  
  
      if (
        !cp ||
        cp.corridaId !==
          corridaId
      ) {
  
        mostrarMensagem(
          'O checkpoint selecionado não pertence à corrida escolhida.',
          'error'
        );
  
        return;
  
      }
  
  
      if (
        !equipeRepo
          .listar()
          .some(
            x =>
              x.id ===
              equipeId
          )
      ) {
  
        mostrarMensagem(
          'Selecione uma equipe válida.',
          'error'
        );
  
        return;
  
      }
  
  
      const d = {
  
        id,
  
        corridaId,
  
        checkpointId,
  
        equipeId,
  
        dataHora:
          document.getElementById(
            'dataHora'
          ).value
  
      };
  
  
      if (id) {
  
        passagemRepo.atualizar(d);
  
      } else {
  
        passagemRepo.novo(d);
  
      }
  
  
      mostrarMensagem(
        id
          ? 'Passagem alterada.'
          : 'Passagem cadastrada.'
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
          passagemRepo
            .listar()
            .find(
              i =>
                i.id == edit
            );
  
  
        document.getElementById(
          'id'
        ).value = x.id;
  
  
        sc.value =
          x.corridaId;
  
  
        atualizarCheckpoints();
  
  
        sp.value =
          x.checkpointId;
  
  
        se.value =
          x.equipeId;
  
  
        document.getElementById(
          'dataHora'
        ).value =
          x.dataHora;
  
  
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
  
      }
  
  
      if (
        del &&
        confirmarExclusao()
      ) {
  
        passagemRepo.excluir(
          Number(del)
        );
  
        mostrarMensagem(
          'Passagem excluída.'
        );
  
        render();
  
      }
  
    }
  );
  
  
  document.getElementById(
    'cancelar'
  ).onclick = limpar;
  
  
  render();