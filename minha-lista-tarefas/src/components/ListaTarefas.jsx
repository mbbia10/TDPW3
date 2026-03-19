import { useState } from 'react';

function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [ordem, setOrdem] = useState('data');

  const adicionarTarefa = () => {
    if (novaTarefa.trim() !== '') {
      const nova = {
        texto: novaTarefa,
        data: new Date()
      };

      setTarefas([...tarefas, nova]);
      setNovaTarefa('');
    }
  };

  const removerTarefa = (indice) => {
    setTarefas(tarefas.filter((_, i) => i !== indice));
  };

  const tarefasOrdenadas = [...tarefas].sort((a, b) => {
    if (ordem === 'alfabetica') {
      return a.texto.localeCompare(b.texto);
    } else {
      return new Date(b.data) - new Date(a.data);
    }
  });

  return (
    <div>
      <h2>Lista de Tarefas</h2>

      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Digite uma nova tarefa"
      />
      <button onClick={adicionarTarefa}>Adicionar</button>

      <div>
        <button onClick={() => setOrdem('data')}>
          Ordenar por Data
        </button>
        <button onClick={() => setOrdem('alfabetica')}>
          Ordenar A-Z
        </button>
      </div>
      
      <ul>
        {tarefasOrdenadas.map((tarefa, indice) => (
          <li key={indice}>
            {tarefa.texto} 
            <button onClick={() => removerTarefa(indice)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;