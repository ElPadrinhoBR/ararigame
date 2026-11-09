@echo off
title Arari Game - dominATE Concert Mission
echo ========================================================
echo  Iniciando Servidor Local para o Jogo da Arari...
echo ========================================================
echo.
cd /d "d:\PROJETOS\radar_ccnet\ararigame"
start "" "http://localhost:8080"
python -m http.server 8080
pause
