import { useState, useEffect } from 'react';
import './ListaTarefas.css';
function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [ordem, setOrdem] = useState('data');

  // 🔹 CARREGAR tarefas ao iniciar
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }
  }, []);

  // 🔹 SALVAR sempre que mudar
  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() !== '') {
      const nova = {
        texto: novaTarefa,
        data: new Date(),
        concluida: false
      };

      setTarefas([...tarefas, nova]);
      setNovaTarefa('');
    }
  };

  const removerTarefa = (indice) => {
    setTarefas(tarefas.filter((_, i) => i !== indice));
  };

  const toggleConcluida = (indice) => {
    const novasTarefas = tarefas.map((tarefa, i) => {
      if (i === indice) {
        return { ...tarefa, concluida: !tarefa.concluida };
      }
      return tarefa;
    });

    setTarefas(novasTarefas);
  };

  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    if (ordem === 'alfabetica') {
      return a.texto.localeCompare(b.texto);
    } else {
      return new Date(b.data) - new Date(a.data);
    }
  });

  return (
    <div className="container">
      <h2>Lista de Tarefas</h2>
  
      <div>
        <input
          type="text"
          value={novaTarefa}
          onChange={(e) => setNovaTarefa(e.target.value)}
          placeholder="Digite uma nova tarefa"
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>
  
      <div>
        <button onClick={() => setOrdem('data')}>
          Data
        </button>
        <button onClick={() => setOrdem('alfabetica')}>
          A-Z
        </button>
      </div>
      
      <ul>
        {tarefasOrdenadas.map((tarefa, indice) => (
          <li key={indice}>
            
            <span className={tarefa.concluida ? 'concluida' : ''}>
              {tarefa.texto}
            </span>
  
            <div>
              <button onClick={() => toggleConcluida(indice)}>
                ✓
              </button>
  
              <button onClick={() => removerTarefa(indice)}>
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