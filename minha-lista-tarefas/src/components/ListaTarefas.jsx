import { useState, useEffect, useMemo } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [ordem, setOrdem] = useState('data');

  // 1. Carregar tarefas do LocalStorage ao montar o componente
  useEffect(() => {
    const dados = localStorage.getItem('tarefas');
    if (dados) {
      try {
        setTarefas(JSON.parse(dados));
      } catch (e) {
        console.error("Erro ao carregar tarefas", e);
      }
    }
  }, []);

  // 2. Salvar tarefas no LocalStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') return;

    const nova = {
      id: Date.now(),
      texto: novaTarefa,
      data: Date.now(),
      concluida: false
    };

    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  const toggleConcluida = (id) => {
    setTarefas(
      tarefas.map(t =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );
  };

  // 3. Lógica de Ordenação com useMemo (Recalcula apenas quando necessário)
  const tarefasOrdenadas = useMemo(() => {
    const listaParaOrdenar = [...tarefas];

    if (ordem === 'alfabetica') {
      return listaParaOrdenar.sort((a, b) => 
        // localeCompare com sensitivity 'base' ignora maiúsculas e acentos
        a.texto.localeCompare(b.texto, undefined, { sensitivity: 'base' })
      );
    }

    if (ordem === 'data') {
      return listaParaOrdenar.sort((a, b) => b.data - a.data);
    }

    return listaParaOrdenar;
  }, [tarefas, ordem]);

  return (
    <div className="container">
      <h2>Minhas Tarefas</h2>

      <div className="input-group">
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="O que precisa ser feito?"
          onKeyDown={(e) => e.key === 'Enter' && adicionarTarefa()}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div className="filtros">
        <button 
          className={ordem === 'data' ? 'active' : ''} 
          onClick={() => setOrdem('data')}
        >
          Recentes
        </button>
        <button 
          className={ordem === 'alfabetica' ? 'active' : ''} 
          onClick={() => setOrdem('alfabetica')}
        >
          A-Z
        </button>
      </div>

      <ul>
        {tarefasOrdenadas.map((tarefa) => (
          <li key={tarefa.id} className="tarefa-item">
            <span 
              className={tarefa.concluida ? 'concluida' : ''}
              onClick={() => toggleConcluida(tarefa.id)}
              style={{ cursor: 'pointer' }}
            >
              {tarefa.texto}
            </span>

            <div className="acoes">
              <button onClick={() => toggleConcluida(tarefa.id)}>
                {tarefa.concluida ? '↩' : '✓'}
              </button>
              <button onClick={() => removerTarefa(tarefa.id)}>
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {tarefas.length === 0 && <p>Nenhuma tarefa por enquanto!</p>}
    </div>
  );
}

export default ListaTarefas;