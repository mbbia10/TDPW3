import { useState, useEffect, useMemo } from 'react';
import './ListaTarefas.css';

function ListaTarefas() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [descricao, setDescricao] = useState(''); // NOVO ESTADO
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
      descricao: descricao, // SALVANDO A DESCRIÇÃO
      data: Date.now(),
      concluida: false
    };

    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
    setDescricao(''); // LIMPA O CAMPO
  };

  const tarefasOrdenadas = useMemo(() => {
    const lista = [...tarefas];
    if (ordem === 'alfabetica') {
      return lista.sort((a, b) => a.texto.localeCompare(b.texto, undefined, { sensitivity: 'base' }));
    }
    return lista.sort((a, b) => b.data - a.data);
  }, [tarefas, ordem]);

  return (
    <div className="page-wrapper"> {/* WRAPPER PARA CENTRALIZAR TUDO */}
      <div className="container">
        <h2>Task Master Pro</h2>

        <div className="input-group">
          <input
            type="text"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Título da tarefa..."
          />
          <input
            type="text"
            className="input-desc"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Breve descrição (opcional)"
          />
          <button onClick={adicionarTarefa}>Adicionar</button>
        </div>

        <div className="filtros">
          <button className={ordem === 'data' ? 'active' : ''} onClick={() => setOrdem('data')}>Recentes</button>
          <button className={ordem === 'alfabetica' ? 'active' : ''} onClick={() => setOrdem('alfabetica')}>A-Z</button>
        </div>

        <ul>
          {tarefasOrdenadas.map((tarefa) => (
            <li key={tarefa.id} className="tarefa-item">
              <div className="info-tarefa">
                <strong className={tarefa.concluida ? 'concluida' : ''}>{tarefa.texto}</strong>
                {tarefa.descricao && <p className="desc-text">{tarefa.descricao}</p>}
              </div>
              <div className="acoes">
                <button onClick={() => setTarefas(tarefas.filter(t => t.id !== tarefa.id))}>✕</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListaTarefas;