import logger from './logger'
import { DoesNotExist } from '~/models'

export default function handleErrors (app) {
  app.use(NotFoundHandler)
  app.use(_404Handler)
}

/**
 * catch `DoesNotExist` from db
 */
export const NotFoundHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (!(err instanceof DoesNotExist)) {
      throw err
    }
    logger.info(`404 - ${ctx.method} ${ctx.url}`)
    ctx.status = 404
    switch (ctx.accepts(['html', 'json', 'image/*'])) {
      case 'html': {
        await ctx.render('error', {
          status: 404,
          message: err.message
        })
        break
      }
      case 'json': {
        ctx.body = {message: err.message}
      }
    }
  }
}

/**
 * catch 404 http-error
 */
export const _404Handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (Number(err.status) !== 404) {
      throw err
    }
    logger.info(`404 - ${ctx.method} ${ctx.url}`)
    ctx.status = 404
    switch (ctx.accepts(['html', 'json'])) {
      case 'html': {
        await ctx.render('error', {
          status: err.status,
          message: err.message
        })
        break
      }
      case 'json': {
        ctx.body = {
          status: err.status,
          message: err.message || 'Not found'
        }
        break
      }
      default: {
        ctx.res.end()
        break
      }
    }
  }
}

/**
 * The "final" handler, means this case of error does not been considered
 */
export const unhandledHandler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = 500
    logger.error(`500 - ${err.name}: ${err.message}`)
    switch (ctx.accepts(['html', 'json'])) {
      case 'html': {
        await ctx.render('error', {
          status: err.status,
          message: 'internal error'
        })
        break
      }
      case 'json': {
        ctx.body = {
          errorName: err.name,
          errorMessage: err.message
        }
        break
      }
      default: {
        ctx.res.end()
        break
      }
    }
  }
}
