#!/bin/bash

# Comando exato que estava no package.json com logs adicionados
echo "=== Iniciando script postbuild ==="

echo "Copiando manifest.webmanifest do PT para pasta PT..."
npx shx cp -r public/pt/manifest.webmanifest dist/negra-midia/browser/pt/
if [ $? -eq 0 ]; then echo "✓ Cópia para PT concluída com sucesso"; else echo "✗ Erro na cópia para PT"; exit 1; fi

echo "Copiando manifest.webmanifest do EN para pasta EN..."
npx shx cp -r public/en/manifest.webmanifest dist/negra-midia/browser/en/
if [ $? -eq 0 ]; then echo "✓ Cópia para EN concluída com sucesso"; else echo "✗ Erro na cópia para EN"; exit 1; fi

echo "Copiando manifest.webmanifest do ES para pasta ES..."
npx shx cp -r public/es/manifest.webmanifest dist/negra-midia/browser/es/
if [ $? -eq 0 ]; then echo "✓ Cópia para ES concluída com sucesso"; else echo "✗ Erro na cópia para ES"; exit 1; fi

echo "=== Script postbuild concluído com sucesso! ==="
