export class Corrida {

    constructor(id, nome, descricao, data) {
  
      this.id = Number(id);
      this.nome = nome;
      this.descricao = descricao || '';
      this.data = data;
  
    }
  
  }
  
  
  export class Checkpoint {
  
    constructor(
      id,
      identificacaoLocal,
      professorResponsavel,
      ordem,
      corridaId
    ) {
  
      this.id = Number(id);
  
      this.identificacaoLocal =
        identificacaoLocal;
  
      this.professorResponsavel =
        professorResponsavel;
  
      this.ordem = Number(ordem);
  
      this.corridaId = Number(corridaId);
  
      this.corrida = null;
  
    }
  
    vincularCorrida(corrida) {
  
      this.corrida = corrida;
  
      this.corridaId = corrida.id;
  
    }
  
  }
  
  
  export class Equipe {
  
    constructor(
      id,
      nome,
      numero,
      integrantes
    ) {
  
      this.id = Number(id);
  
      this.nome = nome;
  
      this.numero = Number(numero);
  
      this.integrantes = integrantes;
  
    }
  
  }
  
  
  export class Passagem {
  
    constructor(
      id,
      corridaId,
      checkpointId,
      equipeId,
      dataHora
    ) {
  
      this.id = Number(id);
  
      this.corridaId =
        Number(corridaId);
  
      this.checkpointId =
        Number(checkpointId);
  
      this.equipeId =
        Number(equipeId);
  
      this.dataHora = dataHora;
  
      this.corrida = null;
  
      this.checkpoint = null;
  
      this.equipe = null;
  
    }
  
    vincular(
      corrida,
      checkpoint,
      equipe
    ) {
  
      this.corrida = corrida;
  
      this.checkpoint = checkpoint;
  
      this.equipe = equipe;
  
      this.corridaId = corrida.id;
  
      this.checkpointId = checkpoint.id;
  
      this.equipeId = equipe.id;
  
    }
  
  }