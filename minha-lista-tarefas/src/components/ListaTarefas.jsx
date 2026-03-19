import { useState, useEffect, useMemo } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ordem, setOrdem] = useState('data');

  useEffect(() => {
    const dados = localStorage.getItem('tarefas');
    if (dados) setTarefas(JSON.parse(dados));
  }, []);

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  const adicionarTarefa = () => {
    if (novaTarefa.trim() === '') return;
    const nova = {
      id: Date.now(),
      texto: novaTarefa,
      descricao: descricao,
      data: Date.now(),
      concluida: false
    };
    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
    setDescricao('');
  };

  const toggleConcluida = (id) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter(t => t.id !== id));
  };

  const tarefasOrdenadas = useMemo(() => {
    const lista = [...tarefas];
    if (ordem === 'alfabetica') {
      return lista.sort((a, b) => a.texto.localeCompare(b.texto, undefined, { sensitivity: 'base' }));
    }
    return lista.sort((a, b) => b.data - a.data);
  }, [tarefas, ordem]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Task Master Pro</h2>

        <div className="input-section">
          <input
            type="text"
            className="input-main"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Título da tarefa..."
          />
          <input
            type="text"
            className="input-sub"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Adicionar descrição..."
          />
          <button className="btn-add" onClick={adicionarTarefa}>Adicionar Tarefa</button>
        </div>

        <div className="filtros">
          <button className={ordem === 'data' ? 'active' : ''} onClick={() => setOrdem('data')}>🕒 Recentes</button>
          <button className={ordem === 'alfabetica' ? 'active' : ''} onClick={() => setOrdem('alfabetica')}>🔤 A-Z</button>
        </div>

        <ul className="lista-tarefas">
          {tarefasOrdenadas.map((tarefa) => (
            <li key={tarefa.id} className={`tarefa-item ${tarefa.concluida ? 'item-concluido' : ''}`}>
              <div className="info-tarefa" onClick={() => toggleConcluida(tarefa.id)}>
                <div className="checkbox">
                  {tarefa.concluida ? '✓' : ''}
                </div>
                <div className="texto-wrapper">
                  <strong className="titulo-tarefa">{tarefa.texto}</strong>
                  {tarefa.descricao && <p className="desc-tarefa">{tarefa.descricao}</p>}
                </div>
              </div>
              <button className="btn-delete" onClick={() => removerTarefa(tarefa.id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListaTarefas;