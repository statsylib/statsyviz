import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

// Utility function to render the template with substituted values
async function renderTemplate(filePath: string, data: Record<string, string>) {
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(await Deno.readFile(filePath));
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || "");
}

const app = new Application()

const router = new Router();
router.get("/statistics/:dataset", async (context) => {
  const dataset = context.params.name ?? "pacb";
  const html = await renderTemplate("./templates/statistics.html", { dataset });
  context.response.headers.set("Content-Type", "text/html");
  context.response.body = html;
});

router.get('/', context => {
  context.response.body = '<!DOCTYPE html><html><body><a href="statistics/pacb">pacb</a></body></html>'
})

app.use(router.routes())

const ROOT_DIR = "./static", ROOT_DIR_PATH = "/static";
app.use(async (context,next) => {
  if (!context.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
    next();
    return;
  }
  const filePath = context.request.url.pathname.replace(ROOT_DIR_PATH, "");
  await send(context, filePath, {
    root: ROOT_DIR,
  });
});

const port: number = 8080;
app.addEventListener("listen", ({ port }) => console.log(`listening on port: ${port}`) )
await app.listen({ port })
