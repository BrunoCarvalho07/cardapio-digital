export default function ProdutoCard({ produto, aoAdicionar }) {
  return (
    <div className="bg-white border border-azulejo/10 rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <img src={produto.imagemUrl} alt={produto.nome} className="w-full h-44 object-cover" />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg text-grafite">{produto.nome}</h3>
        <p className="text-grafite/60 text-sm mt-1 flex-1">{produto.descricao}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-grafite/20">
          <span className="text-telha font-display font-bold text-lg">R$ {produto.preco.toFixed(2).replace(".", ",")}</span>
          <button onClick={() => aoAdicionar(produto)} className="bg-dourado text-azulejo px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}