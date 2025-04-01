import json
import re

# Função para ler o arquivo e extrair o array de stencils
def ler_stencils(arquivo):
    try:
        # Abrindo e lendo o arquivo completo
        with open(arquivo, 'r', encoding='utf-8') as f:
            dados = f.read()

        # Usando uma expressão regular para capturar apenas o conteúdo JSON
        json_match = re.search(r'\{.*\}', dados, re.DOTALL)
        
        if not json_match:
            print("Erro: Não foi possível encontrar o JSON no arquivo.")
            return

        # Pegando apenas o conteúdo JSON
        json_str = json_match.group(0)

        # Fazendo o parsing da string JSON
        json_data = json.loads(json_str)

        # Fazendo o parsing do campo ObjectStatus
        object_status = json.loads(json_data['ObjectStatus'])

        # Pegando o array de stencils
        stencils = object_status.get('Stencil', [])

        # Iterando sobre os stencils e exibindo cada um
        for stencil in stencils:
            print(stencil)
            print("\n")

    except FileNotFoundError:
        print(f"Erro: O arquivo {arquivo} não foi encontrado.")
    except json.JSONDecodeError as e:
        print(f"Erro ao fazer o parsing do JSON: {e}")

# Caminho do arquivo que você carregou
arquivo = 'backend\dashboard\services\data.txt'

# Chamando a função para ler os dados
ler_stencils(arquivo)
