"use client"

import Sidebar from "@/components/Sidebar";
import cookie from "cookie"
import { useRouter } from "next/navigation";
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import ImageStencil from "../../../assets/Stencil.jpeg"
import InovaBottomImage from "@/components/InovaBottomImage";

const ConformityReport = () => {
  const { register, handleSubmit } = useForm();
  const router = useRouter()

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleLogout = useCallback(() => {
    // Remover o cookie definindo uma data de expiração no passado
    document.cookie = cookie.serialize('authToken', '', {
      httpOnly: false, // No lado do cliente, httpOnly deve ser false
      secure: process.env.NODE_ENV !== 'development',
      maxAge: -1, // Expira imediatamente
      path: '/',
    });

    // Redireciona para a página de login
    router.push('/pages/login');
  }, [router]);

  return (
    <main className="lg:ml-[23rem] p-4">
      <Sidebar logouFunction={handleLogout} />
      <div className="flex flex-col min-h-screen relative">
        
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-4 relative">
          <h1 className="text-3xl font-bold mb-4">Relatório de Conformidade</h1>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Nº Cliente:</label>
              <input {...register('clienteNum')} className="border w-full p-2" />
            </div>

            <div>
              <label className="block font-medium">Processos:</label>
              <input {...register('processos')} className="border w-full p-2" />
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('corteLaser')} className="mr-2" />
              <label className="font-medium">Corte laser</label>
              <input type="checkbox" {...register('hibrido')} className="ml-4 mr-2" />
              <label className="font-medium">Híbrido</label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Nº MF:</label>
              <input {...register('mfNum')} className="border w-full p-2" />
            </div>

            <div>
              <label className="block font-medium">Nº OS:</label>
              <input {...register('osNum')} className="border w-full p-2" />
            </div>

            <div>
              <label className="block font-medium">Nº NF:</label>
              <input {...register('nfNum')} className="border w-full p-2" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-6 mb-2">METAL</h2>
          <hr className="border-t-2 border-black mb-4" />

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center col-span-2">
              <input type="checkbox" {...register('dimensoesAco')} className="mr-2" />
              <label className="font-medium">Aço inox nas dimensões:</label>
              <input type="text" placeholder="580x580 mm" {...register('dimensoes')} className="border ml-2 w-24 p-2" />
            </div>

            <div className="flex items-center">
              <label className="font-medium mr-2">Espessura:</label>
              <input type="number" {...register('espessura')} className="border w-16 p-2" /> mm
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center">
              <input type="checkbox" {...register('limpezaOk')} className="mr-2" />
              <label className="font-medium">Limpeza Ok</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('quantidadeOk')} className="mr-2" />
              <label className="font-medium">Quantidade Ok</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('condicaoSuperficieOk')} className="mr-2" />
              <label className="font-medium">Condição de Superfície Ok</label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-medium">Código gravado:</label>
            <input {...register('codigoGravado')} className="border w-full p-2" />
          </div>

          <h3 className="text-lg font-semibold mb-2">Gravações</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center">
              <input type="checkbox" {...register('ladoRodo')} className="mr-2" />
              <label className="font-medium">Lado Rodo</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('ladoPlaca')} className="mr-2" />
              <label className="font-medium">Lado Placa</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('logotipoMetalfoto')} className="mr-2" />
              <label className="font-medium">Logotipo: Metalfoto</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('logotipoOk')} className="mr-2" />
              <label className="font-medium">Ok</label>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">Imagem</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="flex items-center">
              <input type="checkbox" {...register('imagemCentralizada')} className="mr-2" />
              <label className="font-medium">Centralizada</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('imagemLadoRodo')} className="mr-2" />
              <label className="font-medium">Lado Rodo</label>
            </div>

            <div className="flex items-center">
              <input type="checkbox" {...register('imagemLadoPlaca')} className="mr-2" />
              <label className="font-medium">Lado Placa</label>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Quadro / Frame</h2>
          <hr className="border-t-2 border-black mb-4" />

          <div className="flex items-center mb-4 ">
            <label className="font-medium mr-2">Fornecido por: </label>
            <input type="radio" value="Metalfoto" {...register('fornecidoPor')} className="mr-2" />
            <label className="font-medium">Metalfoto</label>
            <input type="radio" value="Cliente" {...register('fornecidoPor')} className="ml-4 mr-2" />
            <label className="font-medium">Pelo cliente</label>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block font-medium">Dimensões:</label>
              <input type="text" placeholder="29x29 (736x736 mm)" {...register('dimensoesQuadro')} className="border w-full p-2" />
            </div>

            <div>
              <label className="block font-medium">Perfil:</label>
              <input type="text" placeholder="1½x1½ (38x38 mm)" {...register('perfilQuadro')} className="border w-full p-2" />
            </div>
          </div>

          <div className="flex items-center mb-4">
            <input type="checkbox" {...register('esticamentoOk')} className="mr-2" />
            <label className="font-medium">Esticamento Ok</label>
          </div>

          <div className="space-y-2 border-b-[1px] border-y-black">
            <h1 className="text-2xl font-semibold">Medição da tensão do stencil</h1>
          </div>
          <br />

          {/* Imagem e Tabela */}
          <div className="grid grid-cols-12 gap-4">
            {/* Imagem */}
            <div className="col-span-6 border p-2">
              <img src={ImageStencil.src} alt="Imagem do Stencil" className="w-full object-contain" />
              <p className="text-sm italic mt-2">Nota: Tensões medidas conforme procedimento interno Smart</p>
            </div>

            {/* Tabela de pontos */}
            <div className="col-span-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Ponto</th>
                    <th className="text-left p-2">Valor encontrado</th>
                    <th className="text-left p-2">Especificações</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((ponto) => (
                    <tr key={ponto} className="border-b">
                      <td className="p-2">{ponto}</td>
                      <td className="p-2">
                        <input
                          {...register(`ponto${ponto}`)}
                          className="border p-1 w-full"
                          type="text"
                        />
                      </td>
                      {ponto === 1 && (
                        <td rowSpan={4} className="p-2 align-top">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Os pontos de medições devem estar posicionados conforme indicado na imagem ao lado.</li>
                            <li>A medição deve ser feita no lado da placa.</li>
                            <li>Valor mínimo 30 N/cm</li>
                            <li>Valor nominal 39 N/cm</li>
                            <li>Valor máximo 48 N/cm</li>
                          </ul>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="block font-semibold">Obs:</label>
            <textarea
              {...register('obs')}
              className="border p-2 w-full h-20 resize-none"
            ></textarea>
          </div>

          {/* Contagens de arranhões */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Contagens de arranhões</h2>
            <p className="text-sm italic">
              Verso: Imagem do stencil vista lado Rodo, com a medição das aberturas designadas com alvo.
            </p>
          </div>

          {/* Aprovação e Data */}
          <div className="grid grid-cols-2 gap-4">
            {/* Aprovação */}
            <div className="space-y-2">
              <label className="block font-semibold">Aprovado por:</label>
              <input
                {...register('aprovador')}
                className="border p-2 w-full"
                type="text"
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <label className="block font-semibold">Data:</label>
              <input
                {...register('data')}
                className="border p-2 w-full"
                type="date"
              />
            </div>
          </div>

          {/* Rodapé com informações */}
          <div className="space-y-4 gap">
            <div className="text-sm">
              <p>Certificamos que o material foi produzido de acordo com suas normas e especificações, satisfazendo o requerido.</p>
              <p>O material foi produzido conforme Sistema da Qualidade Certificado NBR ISO 9001:2015;</p>
              <p>O certificado é emitido por processamento eletrônico de dados e é validado sem assinatura.</p>
            </div>
            <br />
            <div className="flex justify-between items-center text-sm">
              <span>www.metalfoto.cm.br</span>
              <span>Fone: (11) 4615 5300</span>
            </div>
          </div>
          <br />

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Enviar</button>
        </form>
      </div>
    </main>
  );
};

export default ConformityReport;
