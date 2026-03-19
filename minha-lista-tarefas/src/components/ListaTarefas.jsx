import { useState, useEffect } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [ordem, setOrdem] = useState('data');

  // carregar
  useEffect(() => {
    const dados = localStorage.getItem('tarefas');
    if (dados) {
      setTarefas(JSON.parse(dados));
    }
  }, []);

  // salvar
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') return;

    const nova = {
      id: Date.now(), // 🔥 ID ÚNICO
      texto: novaTarefa,
      data: Date.now(), // 🔥 salva como número
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

  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    if (ordem === 'alfabetica') {
      return a.texto.localeCompare(b.texto);
    }
    return b.data - a.data; // 🔥 agora funciona
  });

  return (
    <div className="container">
      <h2>Lista de Tarefas</h2>

      <div>
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Digite uma tarefa"
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <div>
        <button onClick={() => setOrdem('data')}>Data</button>
        <button onClick={() => setOrdem('alfabetica')}>A-Z</button>
      </div>

      <ul>
        {tarefasOrdenadas.map((tarefa) => (
          <li key={tarefa.id}>
            <span className={tarefa.concluida ? 'concluida' : ''}>
              {tarefa.texto}
            </span>

            <div>
              <button onClick={() => toggleConcluida(tarefa.id)}>
                ✓
              </button>
              <button onClick={() => removerTarefa(tarefa.id)}>
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;