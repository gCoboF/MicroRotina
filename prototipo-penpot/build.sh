#!/bin/sh
# Gera plugin.js = spec.js + penpot-render.js
cd "$(dirname "$0")" && cat spec.js penpot-render.js > plugin.js && echo "plugin.js gerado"
