"use client";

import { useEffect, useRef, useState } from "react";

//CARROSSEL//

function CarrosselEmprestimos() {
  const carrosselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const produtos = [
    { imagem: "", nome: "Livro Exemplo 01", link: "#", alt: "Livro 1" },
    { imagem: "", nome: "Livro Exemplo 02", link: "#", alt: "Livro 2" },
    { imagem: "", nome: "Livro Exemplo 03", link: "#", alt: "Livro 3" },
  ];

  const next = () => {
    if (!carrosselRef.current) return;
    const items = carrosselRef.current.children.length;
    setCurrentIndex((i) => (i + 1) % items);
  };

  const prev = () => {
    if (!carrosselRef.current) return;
    const items = carrosselRef.current.children.length;
    setCurrentIndex((i) => (i - 1 + items) % items);
  };

  useEffect(() => {
    if (!carrosselRef.current) return;

    const width = carrosselRef.current.clientWidth;
    carrosselRef.current.style.transform = `translateX(-${currentIndex * width}px)`;
  }, [currentIndex]);

  return (
    <div className="relative max-w-4xl mx-auto mt-8 overflow-hidden text-center">
      <h2 className="text-3xl font-bold text-primary mb-6">Livros</h2>

      <div className="overflow-hidden">
        <div
          ref={carrosselRef}
          className="flex transition-transform duration-500 ease-in-out"
        >
          {produtos.map((p, i) => (
            <div
              key={i}
              className="min-w-full p-4 box-border flex flex-col items-center"
            >
              <div className="w-60 h-80 bg-gray-100 rounded-lg shadow-md flex items-center justify-center text-gray-500">
                <span className="text-sm">Sem imagem</span>
              </div>

              <p className="mt-3 text-gray-700 font-medium w-60">{p.nome}</p>

              <a
                href={p.link}
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded mt-4 inline-block"
              >
                Empréstimos
              </a>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
      >
        ▶
      </button>
    </div>
  );
}

// LISTA DE LIVROS //

function ListaLivros() {
  const [busca, setBusca] = useState("");

  const livros = [
    { id: 1, titulo: "O Senhor dos Anéis", autor: "Tolkien", categoria: "Fantasia", paginas: 1200 },
    { id: 2, titulo: "Dom Quixote", autor: "Cervantes", categoria: "Romance", paginas: 863 },
    { id: 3, titulo: "1984", autor: "George Orwell", categoria: "Distopia", paginas: 328 },
    { id: 4, titulo: "A Revolução dos Bichos", autor: "George Orwell", categoria: "Fábula", paginas: 112 },
    { id: 5, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", categoria: "Infantil", paginas: 96 },
    { id: 6, titulo: "Cem Anos de Solidão", autor: "Gabriel García Márquez", categoria: "Realismo Mágico", paginas: 417 },
    { id: 7, titulo: "Meio Sol Amarelo", autor: "João Ubaldo Ribeiro", categoria: "Romance", paginas: 256 },
    { id: 8, titulo: "A Metamorfose", autor: "Franz Kafka", categoria: "Ficção", paginas: 201 },
    { id: 9, titulo: "O Grande Gatsby", autor: "F. Scott Fitzgerald", categoria: "Romance", paginas: 180 },
    { id: 10, titulo: "Moby Dick", autor: "Herman Melville", categoria: "Aventura", paginas: 635 },
    

  ];

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-primary mb-6">Lista de Livros</h2>

    <input
        type="text"
        placeholder="Buscar livro por título..."
        className="w-full p-3 mb-4 rounded bg-white/20 border border-white/30 
             text-gray-900 placeholder-gray-700"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
          />
 
     

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse bg-white/10 backdrop-blur-md rounded-lg">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Autor</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Páginas</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {livrosFiltrados.map((livro) => (
              <tr key={livro.id} className="hover:bg-primary/20 transition border-b border-white/10">
                <td className="p-3">{livro.titulo}</td>
                <td className="p-3">{livro.autor}</td>
                <td className="p-3">{livro.categoria}</td>
                <td className="p-3">{livro.paginas}</td>

                <td className="p-3 text-center">
                  <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded mr-2">
                    Detalhes
                  </button>

                  <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">
                    Empréstimo
                  </button>
                </td>
              </tr>
            ))}

            {livrosFiltrados.length === 0 && (
              <tr>
             <td colSpan={5} className="p-4 text-center text-gray-700 italic">
                 Nenhum livro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// DEFAULT PAGE //

export default function PageLivros() {
  return (
    <div>
      <CarrosselEmprestimos />
      <ListaLivros />
    </div>
  );
}
