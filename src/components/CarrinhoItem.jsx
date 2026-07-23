export default function CarrinhoItem({ item, aoAlterarQuantidade, aoRemover }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-azulejo/10 shadow-sm p-3">
      <img src={item.imagemUrl} alt={item.nome} className="w-20 h-20 object-cover rounded-xl" />

      <div className="flex-1">
        <h3 className="font-display font-semibold text-grafite">{item.nome}</h3>
        <p className="text-telha font-bold">R$ {item.preco.toFixed(2).replace(".", ",")}</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => aoAlterarQuantidade(item.id, item.quantidade - 1)} className="w-8 h-8 bg-porcelana border border-azulejo/20 rounded-full font-bold text-azulejo hover:bg-azulejo/10 transition-colors">-</button>
        <span className="w-6 text-center font-medium">{item.quantidade}</span>
        <button onClick={() => aoAlterarQuantidade(item.id, item.quantidade + 1)} className="w-8 h-8 bg-porcelana border border-azulejo/20 rounded-full font-bold text-azulejo hover:bg-azulejo/10 transition-colors">+</button>
      </div>

      <button onClick={() => aoRemover(item.id)} className="text-telha text-sm font-medium ml-2 hover:underline">Remover</button>
    </div>
  );
}