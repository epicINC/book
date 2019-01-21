const
	Koa = require('koa'),
	app = new Koa()


app.use(async ctx => {

  ctx.body = `
  ${JSON.stringify(ctx.query)}
  Hello World ${Date.now()}
  `
})

app.listen(3000)