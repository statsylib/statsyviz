deno install
rmdir /s /q static\js\node_modules
xcopy /e /k /h /i node_modules static\js\node_modules
deno run --allow-net --allow-read server.ts