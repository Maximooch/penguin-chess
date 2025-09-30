@echo off
setlocal
echo Starting Chess Game...
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  py -3 server.py
) else (
  python server.py
)
pause