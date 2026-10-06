export function mostrarMensagem(
    texto,
    tipo = 'success'
  ) {
  
    const area =
      document.getElementById(
        'mensagem'
      );
  
    if (!area) {
      return;
    }
  
    area.className =
      'message ' + tipo;
  
    area.textContent = texto;
  
    area.classList.remove(
      'hidden'
    );
  
    setTimeout(
      () =>
        area.classList.add(
          'hidden'
        ),
      3500
    );
  
  }
  
  
  export function confirmarExclusao() {
  
    return window.confirm(
      'Tem certeza que deseja excluir este registro?'
    );
  
  }
  
  
  export function escapeHtml(
    valor = ''
  ) {
  
    return String(valor)
      .replace(
        /[&<>"']/g,
        c => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[c])
      );
  
  }
  
  
  export function configurarBase(
    titulo
  ) {
  
    document.getElementById(
      'titulo'
    ).textContent = titulo;
  
    document.getElementById(
      'mensagem'
    ).classList.add(
      'hidden'
    );
  
  }