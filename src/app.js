import path from 'path'
import config from 'config'
import Koa from 'koa'
import KoaBody from 'koa-body'
import KoaViews from 'koa-views'
import KoaStatic from 'koa-static'
import KoaJson from 'koa-json'
import KoaLogger from 'koa-logger'
import KoaOnError from 'koa-onerror'
import KoaJWT from 'koa-jwt'
import cors from '@koa/cors'

import auth from '~/middlewares/auth'
import indexRouter from '~/routes/index'
import tokenRouter from '~/routes/token'
import postRouter from '~/routes/post'
import categoryRouter from '~/routes/category'
import tagRouter from '~/routes/tag'
import * as db from '~/models'

export const app = new Koa()
export default app

// error handler
KoaOnError(app)

// middlewares
app.use(KoaBody({ multipart: true }))
app.use(KoaLogger())
app.use(KoaJson())
app.use(cors())
app.use(KoaJWT({ secret: config.get('secret'), passthrough: true }))

app.use(auth)

// static files
app.use(KoaStatic(path.join(__dirname, 'public')))

// views
app.use(KoaViews(path.join(__dirname, 'views'), {extension: 'ejs'}))

// routes
app.use(indexRouter.routes(), indexRouter.allowedMethods())
app.use(tokenRouter.routes(), tokenRouter.allowedMethods())
app.use(postRouter.routes(), postRouter.allowedMethods())
app.use(categoryRouter.routes(), categoryRouter.allowedMethods())
app.use(tagRouter.routes(), tagRouter.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

db.connect(config.get('mongo'))
  .then(conn => {
    console.log(`Server Starts`)
    app.listen('8000')
  })
  .catch(err => {
    console.log('Db connection error')
    console.log(err)
  })
