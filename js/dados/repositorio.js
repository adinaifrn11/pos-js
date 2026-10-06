import {
    Corrida,
    Checkpoint,
    Equipe,
    Passagem
  } from '../classes/modelos.js';
  
  import {
    carregar,
    salvar,
    proximoId
  } from './storage.js';
  
  
  export const corridaRepo = {
  
    listar: () =>
      carregar('corridas')
        .map(
          x =>
            new Corrida(
              x.id,
              x.nome,
              x.descricao,
              x.data
            )
        ),
  
    salvarTodos: x =>
      salvar('corridas', x),
  
    novo: d => {
  
      const x =
        new Corrida(
          proximoId('corridas'),
          d.nome,
          d.descricao,
          d.data
        );
  
      salvar(
        'corridas',
        [
          ...carregar('corridas'),
          x
        ]
      );
  
      return x;
  
    },
  
    atualizar: x =>
      salvar(
        'corridas',
        carregar('corridas')
          .map(
            i =>
              i.id === x.id
                ? x
                : i
          )
      ),
  
    excluir: id =>
      salvar(
        'corridas',
        carregar('corridas')
          .filter(
            x => x.id !== id
          )
      )
  
  };
  
  
  export const checkpointRepo = {
  
    listar: () =>
      carregar('checkpoints')
        .map(
          x =>
            new Checkpoint(
              x.id,
              x.identificacaoLocal,
              x.professorResponsavel,
              x.ordem,
              x.corridaId
            )
        ),
  
    novo: d => {
  
      const x =
        new Checkpoint(
          proximoId('checkpoints'),
          d.identificacaoLocal,
          d.professorResponsavel,
          d.ordem,
          d.corridaId
        );
  
      salvar(
        'checkpoints',
        [
          ...carregar('checkpoints'),
          x
        ]
      );
  
      return x;
  
    },
  
    atualizar: x =>
      salvar(
        'checkpoints',
        carregar('checkpoints')
          .map(
            i =>
              i.id === x.id
                ? x
                : i
          )
      ),
  
    excluir: id =>
      salvar(
        'checkpoints',
        carregar('checkpoints')
          .filter(
            x => x.id !== id
          )
      )
  
  };
  
  
  export const equipeRepo = {
  
    listar: () =>
      carregar('equipes')
        .map(
          x =>
            new Equipe(
              x.id,
              x.nome,
              x.numero,
              x.integrantes
            )
        ),
  
    novo: d => {
  
      const x =
        new Equipe(
          proximoId('equipes'),
          d.nome,
          d.numero,
          d.integrantes
        );
  
      salvar(
        'equipes',
        [
          ...carregar('equipes'),
          x
        ]
      );
  
      return x;
  
    },
  
    atualizar: x =>
      salvar(
        'equipes',
        carregar('equipes')
          .map(
            i =>
              i.id === x.id
                ? x
                : i
          )
      ),
  
    excluir: id =>
      salvar(
        'equipes',
        carregar('equipes')
          .filter(
            x => x.id !== id
          )
      )
  
  };
  
  
  export const passagemRepo = {
  
    listar: () =>
      carregar('passagens')
        .map(
          x =>
            new Passagem(
              x.id,
              x.corridaId,
              x.checkpointId,
              x.equipeId,
              x.dataHora
            )
        ),
  
    novo: d => {
  
      const x =
        new Passagem(
          proximoId('passagens'),
          d.corridaId,
          d.checkpointId,
          d.equipeId,
          d.dataHora
        );
  
      salvar(
        'passagens',
        [
          ...carregar('passagens'),
          x
        ]
      );
  
      return x;
  
    },
  
    atualizar: x =>
      salvar(
        'passagens',
        carregar('passagens')
          .map(
            i =>
              i.id === x.id
                ? x
                : i
          )
      ),
  
    excluir: id =>
      salvar(
        'passagens',
        carregar('passagens')
          .filter(
            x => x.id !== id
          )
      )
  
  };
  
  
  export function reconstruirRelacionamentos() {
  
    const corridas =
      corridaRepo.listar();
  
    const checkpoints =
      checkpointRepo.listar();
  
    const equipes =
      equipeRepo.listar();
  
    const passagens =
      passagemRepo.listar();
  
  
    checkpoints.forEach(
      checkpoint => {
  
        const corrida =
          corridas.find(
            corrida =>
              corrida.id ===
              checkpoint.corridaId
          );
  
        if (corrida) {
          checkpoint.vincularCorrida(
            corrida
          );
        }
  
      }
    );
  
  
    passagens.forEach(
      passagem => {
  
        const corrida =
          corridas.find(
            x =>
              x.id === passagem.corridaId
          );
  
        const checkpoint =
          checkpoints.find(
            x =>
              x.id ===
              passagem.checkpointId
          );
  
        const equipe =
          equipes.find(
            x =>
              x.id ===
              passagem.equipeId
          );
  
        if (
          corrida &&
          checkpoint &&
          equipe
        ) {
  
          passagem.vincular(
            corrida,
            checkpoint,
            equipe
          );
  
        }
  
      }
    );
  
  
    return {
      corridas,
      checkpoints,
      equipes,
      passagens
    };
  
  }
  
  
  export function podeExcluirCorrida(id) {
  
    return (
      !checkpointRepo
        .listar()
        .some(
          x =>
            x.corridaId === id
        )
      &&
      !passagemRepo
        .listar()
        .some(
          x =>
            x.corridaId === id
        )
    );
  
  }
  
  
  export function podeExcluirCheckpoint(id) {
  
    return !passagemRepo
      .listar()
      .some(
        x =>
          x.checkpointId === id
      );
  
  }
  
  
  export function podeExcluirEquipe(id) {
  
    return !passagemRepo
      .listar()
      .some(
        x =>
          x.equipeId === id
      );
  
  }